use base64::Engine;
use base64::engine::general_purpose::STANDARD;
use serde::Deserialize;
use serde_json::Value;
use std::fmt;
use std::io::{self, Write};
use std::path::PathBuf;
use std::process::{Command, Stdio};
#[derive(Debug, Clone)]

pub struct ValueValidation {
    pub bun_executable: String,
    pub entrypoint: PathBuf,
}

impl ValueValidation {
    pub fn new(bun_executable: impl Into<String>, entrypoint: impl Into<PathBuf>) -> Self {
        Self {
            bun_executable: bun_executable.into(),
            entrypoint: entrypoint.into(),
        }
    }

    /// Uses default runtime paths.
    ///
    /// - bun executable: `bun`
    /// - entrypoint: `./js/value-validation.js`
    pub fn with_defaults() -> Self {
        Self {
            bun_executable: "bun".to_string(),
            entrypoint: PathBuf::from("./js/value-validation.js"),
        }
    }

    pub fn validate_value(
        &self,
        r#type: String,
        value: Value,
        data_types: Vec<tucana::shared::ExecutionDataType>,
    ) -> Result<ValidationResult, ValidationError> {
        let stdin_payload = serialize_input(input);

        let mut child = Command::new(&self.bun_executable)
            .arg("run")
            .arg(&self.entrypoint)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(ValidationError::Io)?;

        let stdin = child.stdin.as_mut().ok_or_else(|| {
            ValidationError::Io(io::Error::new(
                io::ErrorKind::BrokenPipe,
                "failed to open stdin for bun process",
            ))
        })?;

        stdin
            .write_all(stdin_payload.as_bytes())
            .map_err(ValidationError::Io)?;

        let output = child.wait_with_output().map_err(ValidationError::Io)?;
        let stdout = String::from_utf8(output.stdout).map_err(ValidationError::Utf8)?;
        let stderr = String::from_utf8(output.stderr).map_err(ValidationError::Utf8)?;

        if !output.status.success() {
            return Err(ValidationError::TriangulumFailed {
                status: output.status.code(),
                stdout,
                stderr,
            });
        }

        serde_json::from_str(&stdout).map_err(ValidationError::Json)
    }
}

#[derive(Debug)]
pub enum ValidationError {
    Io(io::Error),
    Utf8(std::string::FromUtf8Error),
    Json(serde_json::Error),
    TriangulumFailed {
        status: Option<i32>,
        stdout: String,
        stderr: String,
    },
}

impl fmt::Display for ValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Io(err) => write!(f, "io error: {err}"),
            Self::Utf8(err) => write!(f, "utf8 decode error: {err}"),
            Self::Json(err) => write!(f, "json parse error: {err}"),
            Self::TriangulumFailed {
                status,
                stdout,
                stderr,
            } => write!(
                f,
                "triangulum value-validation failed (status: {:?})\nOUT:\n{}\n\nERR:\n{}",
                status, stdout, stderr
            ),
        }
    }
}

impl std::error::Error for ValidationError {}

#[derive(Debug, Clone, Deserialize)]
pub struct ValidationResult {
    #[serde(rename = "isValid")]
    pub is_valid: bool,
    #[serde(rename = "returnType")]
    pub return_type: Option<String>,
    #[serde(default)]
    pub diagnostics: Vec<Diagnostic>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Diagnostic {
    pub message: String,
    pub code: i64,
    pub severity: String,
    #[serde(rename = "nodeId")]
    pub node_id: Option<String>,
    #[serde(rename = "parameterIndex")]
    pub parameter_index: Option<i64>,
}

fn serialize_input<TypeParam, ValueParam, DataTypeParam>(
    input: &ValueValidationInput<TypeParam, ValueParam, DataTypeParam>,
) -> String
where
    TypeParam: ToTypeLine,
    ValueParam: ToValueLine,
    DataTypeParam: ToProtoBytes,
{
    let mut lines = Vec::new();

    lines.push(input.value_type.to_type_line());
    lines.push(String::new());

    lines.push(input.value.to_value_line());
    lines.push(String::new());

    for data_type in &input.data_types {
        lines.push(STANDARD.encode(data_type.to_proto_bytes()));
    }

    lines.push(String::new());

    lines.join("\n")
}

