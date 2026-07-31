import {DataType, FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";

/**
 * Available data types and their TypeScript mappings.
 */
export const DATA_TYPES: DataType[] = [
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/1",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "CRON_DAY_OF_MONTH",
        "genericKeys": [],
        "type": "string",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Day of Month"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "cron;code;schedule;timer;clock;month;day"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Day of Month"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/1"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 1,
            "nodes": [
                {
                    "__typename": "DataTypeRule",
                    "id": "gid://sagittarius/DataTypeRule/1",
                    "variant": "REGEX",
                    "updatedAt": "2026-06-19T15:33:16Z",
                    "createdAt": "2026-06-19T15:33:16Z",
                    "config": {
                        "__typename": "DataTypeRulesRegexConfig",
                        "pattern": "^(\\*|([1-9]|[12]\\d|3[01])(-([1-9]|[12]\\d|3[01]))?)(\\/([1-9]|[12]\\d|3[01]))?(,(\\*|([1-9]|[12]\\d|3[01])(-([1-9]|[12]\\d|3[01]))?)(\\/([1-9]|[12]\\d|3[01]))?)*$"
                    }
                }
            ],
            "pageInfo": {
                "endCursor": "MQ",
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/2",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "CRON_DAY_OF_WEEK",
        "genericKeys": [],
        "type": "string | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Day of Week"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "cron;code;schedule;timer;clock;day;week"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Day of Week"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/1"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 1,
            "nodes": [
                {
                    "__typename": "DataTypeRule",
                    "id": "gid://sagittarius/DataTypeRule/2",
                    "variant": "REGEX",
                    "updatedAt": "2026-06-19T15:33:16Z",
                    "createdAt": "2026-06-19T15:33:16Z",
                    "config": {
                        "__typename": "DataTypeRulesRegexConfig",
                        "pattern": "^(\\*|([0-7])(-([0-7]))?)(\\/([0-7]))?(,(\\*|([0-7])(-([0-7]))?)(\\/([0-7]))?)*$"
                    }
                }
            ],
            "pageInfo": {
                "endCursor": "Mg",
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/3",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "CRON_HOUR",
        "genericKeys": [],
        "type": "string",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Hour"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "cron;code;schedule;timer;clock;hour"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Hour"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/1"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 1,
            "nodes": [
                {
                    "__typename": "DataTypeRule",
                    "id": "gid://sagittarius/DataTypeRule/3",
                    "variant": "REGEX",
                    "updatedAt": "2026-06-19T15:33:16Z",
                    "createdAt": "2026-06-19T15:33:16Z",
                    "config": {
                        "__typename": "DataTypeRulesRegexConfig",
                        "pattern": "^(\\*|([01]?\\d|2[0-3])(-([01]?\\d|2[0-3]))?)(\\/([01]?\\d|2[0-3]))?(,(\\*|([01]?\\d|2[0-3])(-([01]?\\d|2[0-3]))?)(\\/([01]?\\d|2[0-3]))?)*$"
                    }
                }
            ],
            "pageInfo": {
                "endCursor": "Mw",
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/4",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "CRON_MINUTE",
        "genericKeys": [],
        "type": "string",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Minute"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "cron;code;schedule;timer;clock;minute"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Minute"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/1"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 1,
            "nodes": [
                {
                    "__typename": "DataTypeRule",
                    "id": "gid://sagittarius/DataTypeRule/4",
                    "variant": "REGEX",
                    "updatedAt": "2026-06-19T15:33:16Z",
                    "createdAt": "2026-06-19T15:33:16Z",
                    "config": {
                        "__typename": "DataTypeRulesRegexConfig",
                        "pattern": "^(\\*|([0-5]?\\d)(-[0-5]?\\d)?)(\\/[0-5]?\\d)?(,(\\*|([0-5]?\\d)(-[0-5]?\\d)?)(\\/[0-5]?\\d)?)*$"
                    }
                }
            ],
            "pageInfo": {
                "endCursor": "NA",
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/5",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "CRON_MONTH",
        "genericKeys": [],
        "type": "string | 'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC' ",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Month"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "cron;code;schedule;timer;clock;month"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Cron Month"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/1"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 1,
            "nodes": [
                {
                    "__typename": "DataTypeRule",
                    "id": "gid://sagittarius/DataTypeRule/5",
                    "variant": "REGEX",
                    "updatedAt": "2026-06-19T15:33:16Z",
                    "createdAt": "2026-06-19T15:33:16Z",
                    "config": {
                        "__typename": "DataTypeRulesRegexConfig",
                        "pattern": "^(\\*|(0?[1-9]|1[0-2])(-(0?[1-9]|1[0-2]))?)(\\/(0?[1-9]|1[0-2]))?(,(\\*|(0?[1-9]|1[0-2])(-(0?[1-9]|1[0-2]))?)(\\/(0?[1-9]|1[0-2]))?)*$"
                    }
                }
            ],
            "pageInfo": {
                "endCursor": "NQ",
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/7",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "REST_ADAPTER_INPUT",
        "genericKeys": [
            "T"
        ],
        "type": "{ payload: T, headers: OBJECT<{}>, query_params: OBJECT<{}>, path_params: OBJECT<{}> }",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Rest Adapter Input"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;rest;adapter;input"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Rest Adapter Input"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/2"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/8",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "BOOLEAN",
        "genericKeys": [],
        "type": "boolean",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Boolean"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "bool;boolean;bit"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Boolean"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/3"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/10",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "COMPARATOR",
        "genericKeys": [
            "I"
        ],
        "type": "(left: I, right: I) => NUMBER",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Comparator"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "compare;comparator"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Compare ${I}"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/11",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "CONSUMER",
        "genericKeys": [
            "T"
        ],
        "type": "(item: T) => void",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Consumer"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "use;consumer;consume;lambda"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Use ${T}"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/12",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "PREDICATE",
        "genericKeys": [
            "T"
        ],
        "type": "(item: T) => BOOLEAN",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Predicate"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "predicate"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Predicate of ${T}"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/13",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "RUNNABLE",
        "genericKeys": [],
        "type": "() => void",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Node"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "node;function"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Node"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/14",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "TRANSFORM",
        "genericKeys": [
            "I",
            "R"
        ],
        "type": "(item: I) => R",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Transform"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "transform"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Transform ${I} to ${R}"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/15",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_AUTH_PLACE",
        "genericKeys": [
            "T"
        ],
        "type": "T extends 'Bearer' ? 'Header' : T extends 'Basic' ? 'Header' : T extends undefined ? undefined : 'Header' | 'Url'",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP credential placement"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;method;get;post;put;delete;path;head"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP credential placement"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/16",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_AUTH_TYPE",
        "genericKeys": [],
        "type": "'Bearer' | 'Basic' | 'X-API-Key' | string | undefined",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP credential variant"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;method;get;post;put;delete;path;head"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP credential variant"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/17",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_AUTH_VALUE",
        "genericKeys": [
            "T"
        ],
        "type": "T extends 'Basic' ? { username: string, password: string } : T extends undefined ? undefined : string",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP credential value"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;method;get;post;put;delete;path;head"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP credential value"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/18",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_METHOD",
        "genericKeys": [],
        "type": "'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Method"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;method;get;post;put;delete;path;head"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Method"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/19",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_PAYLOAD",
        "genericKeys": [
            "T"
        ],
        "type": "T extends 'application/json' ? OBJECT<{}> : T extends undefined ? undefined : string",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP payload"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;method;get;post;put;delete;path;head"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP payload"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/21",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_URL",
        "genericKeys": [],
        "type": "TEXT",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Route"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;route;url"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Route"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 1,
            "nodes": [
                {
                    "__typename": "DataTypeRule",
                    "id": "gid://sagittarius/DataTypeRule/6",
                    "variant": "REGEX",
                    "updatedAt": "2026-06-19T15:33:16Z",
                    "createdAt": "2026-06-19T15:33:16Z",
                    "config": {
                        "__typename": "DataTypeRulesRegexConfig",
                        "pattern": "^/\\w+(?:[.:~-]\\w+)*(?:/\\w+(?:[.:~-]\\w+)*)*$"
                    }
                }
            ],
            "pageInfo": {
                "endCursor": "Ng",
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/22",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_REQUEST",
        "genericKeys": [
            "T"
        ],
        "type": "{ http_method: HTTP_METHOD, url: HTTP_URL, payload: T, headers: OBJECT<{}> }",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Request"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;request"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Request"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/23",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_STATUS_CODE",
        "genericKeys": [],
        "type": "NUMBER",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Status Code"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;status;code"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Status Code"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 1,
            "nodes": [
                {
                    "__typename": "DataTypeRule",
                    "id": "gid://sagittarius/DataTypeRule/7",
                    "variant": "NUMBER_RANGE",
                    "updatedAt": "2026-06-19T15:33:16Z",
                    "createdAt": "2026-06-19T15:33:16Z",
                    "config": {
                        "__typename": "DataTypeRulesNumberRangeConfig",
                        "from": 100,
                        "steps": 0,
                        "to": 599
                    }
                }
            ],
            "pageInfo": {
                "endCursor": "Nw",
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/24",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_RESPONSE",
        "genericKeys": [
            "T"
        ],
        "type": "{ payload: T, headers: OBJECT<{}>, http_status_code: HTTP_STATUS_CODE }",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Response"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;response;object"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP Response"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/25",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "HTTP_SCHEMA",
        "genericKeys": [],
        "type": "'application/json' | 'application/xml' | 'text/plain' | 'text/csv' | string | undefined",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP schema"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "http;method;get;post;put;delete;path;head"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "HTTP schema"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/26",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "LIST",
        "genericKeys": [
            "T"
        ],
        "type": "T[]",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Generic List"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "list;array;collection"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "List of ${T}"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/9",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "NUMBER",
        "genericKeys": [],
        "type": "number",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Number"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "number;integer;float;double;long"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Number"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/6",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "OBJECT",
        "genericKeys": [
            "T"
        ],
        "type": "{ [K in keyof T]: T[K] }",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Object"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "object;struct;data"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Object"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/8"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/27",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "TYPE",
        "genericKeys": [
            "T"
        ],
        "type": "T",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Type"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "type;data type;data-type;datatype;type definition;type-definition;type-def;typedef"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Type of ${T}"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/8"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/20",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "TEXT",
        "genericKeys": [],
        "type": "string",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Text"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "text;char;literal;string"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Text"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/28",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "TEXT_ENCODING",
        "genericKeys": [],
        "type": "'BASE64'",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Text Encoding"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "text;encoding;base64"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Text Encoding"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    },
    {
        "__typename": "DataType",
        "id": "gid://sagittarius/DataType/10",
        "createdAt": "2026-06-19T15:33:16Z",
        "updatedAt": "2026-06-19T15:34:59Z",
        "identifier": "DATE",
        "genericKeys": [],
        "type": "number",
        "definitionSource": "",
        "version": "0.0.0",
        "name": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Date"
            }
        ],
        "aliases": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "date;day;day of month;calendar day"
            }
        ],
        "displayMessages": [
            {
                "__typename": "Translation",
                "code": "en-US",
                "content": "Date"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/10"
        },
        "rules": {
            "__typename": "DataTypeRuleConnection",
            "count": 0,
            "nodes": [],
            "pageInfo": {
                "endCursor": null,
                "hasNextPage": false,
                "__typename": "PageInfo"
            }
        }
    }
];

/**
 * Built-in function signatures for validation and type inference.
 */
export const FUNCTION_SIGNATURES: FunctionDefinition[] = [
    {
        "id": "gid://sagittarius/FunctionDefinition/1",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "<S extends HTTP_SCHEMA>(http_status_code: HTTP_STATUS_CODE, headers: OBJECT<{}>, http_schema: S, payload: HTTP_PAYLOAD<S>): void",
        "identifier": "rest::control::respond",
        "displayIcon": "tabler:cube-send",
        "aliases": [
            {
                "code": "en-US",
                "content": "respond;control;http",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Processes an HTTP response and returns it to the requesting client. This function typically completes the HTTP request–response cycle by delivering the server’s final output, such as headers, status codes, and body content, back to the client.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Sends response with status ${http_status_code} and payload ${payload}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Respond",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/2",
            "identifier": "draco-rest"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/1",
                    "identifier": "http_status_code",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "HTTP Status Code",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "An HTTP status code is a three-digit number (100–599) indicating the result of a request (e.g., 200, 404, 500).",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/2",
                    "identifier": "headers",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "HTTP response headers",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A collection of key-value pairs containing additional response metadata.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/3",
                    "identifier": "http_schema",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Content Type",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Specifies the MIME type of the response payload, such as application/json, application/xml, or text/plain. This determines the expected format of the payload parameter.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/4",
                    "identifier": "payload",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Response Payload",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Contains the response payload. For application/json the value must be an OBJECT, for all other content types a plain string is expected.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/1",
            "identifier": "rest::control::respond",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/2",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(value: BOOLEAN): NUMBER",
        "identifier": "std::boolean::as_number",
        "displayIcon": "tabler:toggle-left",
        "aliases": [
            {
                "code": "en-US",
                "content": "to number;numeric;boolean;logic;std;as;number",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Will convert the boolean to a number.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Convert ${value} to number",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Boolean as Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/3",
            "identifier": "taurus-boolean"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/5",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Converts a boolean to a number.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/2",
            "identifier": "std::boolean::as_number",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/3",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(value: BOOLEAN): TEXT",
        "identifier": "std::boolean::as_text",
        "displayIcon": "tabler:toggle-left",
        "aliases": [
            {
                "code": "en-US",
                "content": "to text;string;format number;boolean;logic;std;as;text",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Will convert the boolean to text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Convert ${value} to text",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Boolean as Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/3",
            "identifier": "taurus-boolean"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/6",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Converts a boolean to a text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/3",
            "identifier": "std::boolean::as_text",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/4",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(value: NUMBER): BOOLEAN",
        "identifier": "std::boolean::from_number",
        "displayIcon": "tabler:toggle-left",
        "aliases": [
            {
                "code": "en-US",
                "content": "from number;to boolean;convert;boolean;logic;std;from;number",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Will convert the number to a boolean.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Convert ${value} to boolean",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Boolean from Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/3",
            "identifier": "taurus-boolean"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/7",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Converts a number to a boolean.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/4",
            "identifier": "std::boolean::from_number",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/5",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(value: TEXT): BOOLEAN",
        "identifier": "std::boolean::from_text",
        "displayIcon": "tabler:toggle-left",
        "aliases": [
            {
                "code": "en-US",
                "content": "from text;parse;convert;boolean;logic;std;from;text",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Will convert the string to a boolean.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Convert ${value} to boolean",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Boolean from Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/3",
            "identifier": "taurus-boolean"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/8",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Converts a text to a boolean.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/5",
            "identifier": "std::boolean::from_text",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/6",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(first: BOOLEAN, second: BOOLEAN): BOOLEAN",
        "identifier": "std::boolean::is_equal",
        "displayIcon": "tabler:toggle-left",
        "aliases": [
            {
                "code": "en-US",
                "content": "equal;equals;same;boolean;logic;std;is",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Compares two boolean values for equality. Returns true if they are the same, false otherwise.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Equals ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Is Equal",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/3",
            "identifier": "taurus-boolean"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/9",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The first boolean value to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/10",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The second boolean value to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/6",
            "identifier": "std::boolean::is_equal",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/7",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(value: BOOLEAN): BOOLEAN",
        "identifier": "std::boolean::negate",
        "displayIcon": "tabler:toggle-left",
        "aliases": [
            {
                "code": "en-US",
                "content": "negate;negative;invert;opposite;boolean;logic;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Negates a boolean value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Negate ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Negate Boolean",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/3",
            "identifier": "taurus-boolean"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/11",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The boolean value to negate.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/7",
            "identifier": "std::boolean::negate",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/8",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(condition: BOOLEAN, runnable: RUNNABLE): void",
        "identifier": "std::control::if",
        "displayIcon": "tabler:arrow-ramp-right-2",
        "aliases": [
            {
                "code": "en-US",
                "content": "if;control;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "The 'If' runnable evaluates a boolean condition and, if it is true, executes the provided runnable. If the condition is false, execution continues without running the runnable.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "If ${condition} is True do ${runnable}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "If",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4",
            "identifier": "taurus-control"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/12",
                    "identifier": "condition",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Condition",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Specifies the condition that determines whether the provided runnable should be executed. If this condition evaluates to true, the execution proceeds with the runnable defined in the second parameter.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/13",
                    "identifier": "runnable",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Runnable",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Defines the runnable that runs if the condition evaluates to true.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/8",
            "identifier": "std::control::if",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/9",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(condition: BOOLEAN, runnable: RUNNABLE, else_runnable: RUNNABLE): void",
        "identifier": "std::control::if_else",
        "displayIcon": "tabler:arrow-ramp-right",
        "aliases": [
            {
                "code": "en-US",
                "content": "if_else;control;std;if;else",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Evaluates a condition and executes either the Then Runnable or the Else Runnable.",
                "__typename": "Translation"
            }
        ],
        "documentations": [
            {
                "code": "en-US",
                "content": "Evaluates a boolean condition. If true, executes the Runnable. Otherwise executes the Else Runnable.",
                "__typename": "Translation"
            }
        ],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "If ${condition} is True do ${then_runnable} else ${else_runnable}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "If-Else",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4",
            "identifier": "taurus-control"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/14",
                    "identifier": "condition",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Condition",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Boolean that determines which branch to execute. If true the Runnable runs otherwise the Else Runnable runs.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/15",
                    "identifier": "runnable",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Runnable",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Defines the runnable that runs if the condition evaluates to true.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/16",
                    "identifier": "else_runnable",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Else Runnable",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Defines the runnable that runs if the condition evaluates to false.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/9",
            "identifier": "std::control::if_else",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/10",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "<T>(value: T): T",
        "identifier": "std::control::return",
        "displayIcon": "tabler:arrow-back",
        "aliases": [
            {
                "code": "en-US",
                "content": "return;control;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Ends the current context and returns the specified value to the upper scope.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Return ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Return",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4",
            "identifier": "taurus-control"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/17",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Return Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The value to be returned to the upper context.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/10",
            "identifier": "std::control::return",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/11",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "(): void",
        "identifier": "std::control::stop",
        "displayIcon": "tabler:xbox-x",
        "aliases": [
            {
                "code": "en-US",
                "content": "stop;control;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Terminates the current execution context entirely, halting all ongoing and future iterations. Once invoked, no additional steps or loops within this context will be executed. This node behaves like a global stop or termination signal within the flow.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Stop",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Stop",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4",
            "identifier": "taurus-control"
        },
        "parameterDefinitions": {
            "nodes": [],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/11",
            "identifier": "std::control::stop",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/12",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "<T>(value: T): T",
        "identifier": "std::control::value",
        "displayIcon": "tabler:new-section",
        "aliases": [
            {
                "code": "en-US",
                "content": "value;save;create;control;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Saves the given value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Save ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Set Value",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/4",
            "identifier": "taurus-control"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/18",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The value to save.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/12",
            "identifier": "std::control::value",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/13",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:00Z",
        "signature": "<A extends HTTP_AUTH_TYPE, S extends HTTP_SCHEMA>(http_method: HTTP_METHOD, url: HTTP_URL, http_auth: A, http_auth_value: HTTP_AUTH_VALUE<A>, http_auth_place: HTTP_AUTH_PLACE<A>, http_schema: S, payload: HTTP_PAYLOAD<S>, headers?: OBJECT<{}>): HTTP_RESPONSE<any>",
        "identifier": "http::request::send",
        "displayIcon": "tabler:world-www",
        "aliases": [
            {
                "code": "en-US",
                "content": "send;sends;execute;request;http",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Sends a request to the specified url with the given method, headers and payload, and returns the response as an HTTP_RESPONSE object. This function initiates an HTTP request to a specified endpoint, allowing you to interact with web services or APIs by sending data and receiving responses.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Send request to ${url} with ${payload}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Send HTTP request",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/5",
            "identifier": "taurus-http"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/19",
                    "identifier": "http_method",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "HTTP Method",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Defines the HTTP method to be used, such as GET, POST, PUT, or DELETE.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/20",
                    "identifier": "url",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Request URL",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Specifies the endpoint address, including protocol, host, path, and query parameters, where the request is directed.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/21",
                    "identifier": "http_auth",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Auth Type",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Specifies the authentication variant to use, such as Bearer, Basic, X-API-Key, or a custom scheme. Use undefined to send the request without authentication.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/22",
                    "identifier": "http_auth_value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Auth Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Provides the credentials for the selected authentication type. For Basic auth, supply an object with username and password; for all other types, provide a token or key string.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/23",
                    "identifier": "http_auth_place",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Auth Placement",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Defines where the authentication credentials are attached to the request. Bearer and Basic auth always use Header; custom schemes can be placed in the Header or as a URL query parameter.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/24",
                    "identifier": "http_schema",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Content Type",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Specifies the MIME type of the request payload, such as application/json, application/xml, or text/plain. This determines the expected format of the payload parameter.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/25",
                    "identifier": "payload",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Request Payload",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Contains the request payload. For application/json the value must be an OBJECT, for all other content types a plain string is expected.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/26",
                    "identifier": "headers",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "HTTP Headers",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "An optional collection of key-value pairs containing additional request metadata such as custom headers.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/13",
            "identifier": "http::request::send",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/14",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, index: NUMBER): T",
        "identifier": "std::list::at",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "at;array;list;collection;std;index",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Retrieves the element at a specified index from a list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Get element at ${index} of ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Get Element of List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/27",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list from which to retrieve an element.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/28",
                    "identifier": "index",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Index",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The zero-based index of the element to retrieve.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/14",
            "identifier": "std::list::at",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/15",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(first: LIST<T>, second: LIST<T>): LIST<T>",
        "identifier": "std::list::concat",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "concat;combine;join;append;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Concatenates/combine two lists into a single list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Combine ${first} with ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Combine Lists",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/29",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The first list to concatenate.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/30",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The second list to concatenate.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/15",
            "identifier": "std::list::concat",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/16",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, predicate: PREDICATE<T>): LIST<T>",
        "identifier": "std::list::filter",
        "displayIcon": "tabler:arrow-iteration",
        "aliases": [
            {
                "code": "en-US",
                "content": "filter;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new list containing only the elements from the input list for which the predicate returns true.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Filter elements in ${list} matching ${predicate}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Filter List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/31",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list to be filtered.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/32",
                    "identifier": "predicate",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Filter Predicate",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A function that takes an element of the list and returns a boolean indicating whether the element should be included in the output list.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/16",
            "identifier": "std::list::filter",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/17",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, predicate: PREDICATE<T>): T",
        "identifier": "std::list::find",
        "displayIcon": "tabler:arrow-iteration",
        "aliases": [
            {
                "code": "en-US",
                "content": "find;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the first element from the input list for which the predicate returns true. If no element matches, returns null.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Find first element in ${list} matching ${predicate}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Find Element in List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/33",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list in which an element satisfying the predicate will be searched.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/34",
                    "identifier": "predicate",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Search Predicate",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A function that takes an element of the list and returns a boolean indicating if the element matches the search criteria.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/17",
            "identifier": "std::list::find",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/18",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, predicate: PREDICATE<T>): NUMBER",
        "identifier": "std::list::find_index",
        "displayIcon": "tabler:arrow-iteration",
        "aliases": [
            {
                "code": "en-US",
                "content": "find index;index of;position;array;list;collection;std;find;index",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the zero-based index of the first element for which the predicate returns true. If no element matches, returns -1.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Index of Element in ${list} matching ${predicate}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Find Index of Element in List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/35",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list in which to find the index of an element that satisfies the predicate.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/36",
                    "identifier": "predicate",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Search Predicate",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A function that takes an element of the list and returns a boolean indicating if the element satisfies the search criteria.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/18",
            "identifier": "std::list::find_index",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/19",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, predicate: PREDICATE<T>): T",
        "identifier": "std::list::find_last",
        "displayIcon": "tabler:arrow-iteration",
        "aliases": [
            {
                "code": "en-US",
                "content": "find last;last index;last position;array;list;collection;std;find;last",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the last element from the input list for which the predicate returns true. If no element matches, returns null or equivalent.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Last Element of ${list} matching ${predicate}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Find Last Element in List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/37",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list in which an element satisfying the predicate will be searched.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/38",
                    "identifier": "predicate",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Search Predicate",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A function that takes an element of the list and returns a boolean indicating if the element matches the search criteria.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/19",
            "identifier": "std::list::find_last",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/20",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>): T",
        "identifier": "std::list::first",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "first;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Retrieves the first element from the list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Get First Element in ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "First Element of List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/39",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list from which to retrieve the first element.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/20",
            "identifier": "std::list::first",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/21",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<LIST<T>>): LIST<T>",
        "identifier": "std::list::flat",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "flat;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Flattens a nested list into a single-level list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Flatten ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Flatten List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/40",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Nested List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A list containing sub-lists that will be flattened into a single-level list.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/21",
            "identifier": "std::list::flat",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/22",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, consumer: CONSUMER<T>): void",
        "identifier": "std::list::for_each",
        "displayIcon": "tabler:arrow-iteration",
        "aliases": [
            {
                "code": "en-US",
                "content": "for_each;array;list;collection;std;for;each",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Executes a consumer function for each element in the list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "For each in ${list} do ${consumer}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "For Each Element",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/41",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Each element of this list will be passed to the provided consumer function for processing.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/42",
                    "identifier": "consumer",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Consumer Function",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This function is invoked once for each element in the list. It is not expected to return a value.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/22",
            "identifier": "std::list::for_each",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/23",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, item: T): NUMBER",
        "identifier": "std::list::index_of",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "index_of;array;list;collection;std;index;of",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the zero-based index of the first occurrence of a given item in the specified list. If the item is not found, it typically returns -1.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Get Index of ${item} in ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Index of Item",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/43",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A list of elements in which the specified item will be searched for to determine its index.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/44",
                    "identifier": "item",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Item",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The item for which the function searches in the list and returns the index of its first occurrence.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/23",
            "identifier": "std::list::index_of",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/24",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>): BOOLEAN",
        "identifier": "std::list::is_empty",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "is_empty;array;list;collection;std;is;empty",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the list contains no elements, otherwise returns false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Check if ${list} is empty",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Is List Empty",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/45",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list to check for emptiness.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/24",
            "identifier": "std::list::is_empty",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/25",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(list: LIST<TEXT>, join_text: TEXT): TEXT",
        "identifier": "std::list::join",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "join;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a single concatenated string of text joined by the provided join text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Joins ${list} using '${join_text}'",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Join Text List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/46",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List of Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A list of text elements to combined into a single word.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/47",
                    "identifier": "join_text",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Join Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text that will be used to join the list elements into a single string.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/25",
            "identifier": "std::list::join",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/26",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>): T",
        "identifier": "std::list::last",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "last;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Retrieves the last element from the list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Get Last Element of ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Last Element of List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/48",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list from which to retrieve the last element.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/26",
            "identifier": "std::list::last",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/27",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T, R>(list: LIST<T>, transform: TRANSFORM<T, R>): LIST<R>",
        "identifier": "std::list::map",
        "displayIcon": "tabler:arrow-iteration",
        "aliases": [
            {
                "code": "en-US",
                "content": "map;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Transforms each element in the list using the provided function. This will create a new list of new elements which will be returned.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Apply ${transform} for each in ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Map List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/49",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Each element of this list will be passed through the transform function.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/50",
                    "identifier": "transform",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Transform Function",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The transform function is applied to every element of the list to produce a new list.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/27",
            "identifier": "std::list::map",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/28",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(list: LIST<NUMBER>): NUMBER",
        "identifier": "std::list::max",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "max;maximum;largest;greatest;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Finds the maximum value in a numeric list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Maximum of ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Find Maximum Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/51",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List of Numbers",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A list of numbers to find the maximum value from.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/28",
            "identifier": "std::list::max",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/29",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(list: LIST<NUMBER>): NUMBER",
        "identifier": "std::list::min",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "min;minimum;smallest;least;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Finds the minimum value in a numeric list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Minimum of ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Find Minimum Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/52",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A list of numbers to find the minimum value from.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/29",
            "identifier": "std::list::min",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/30",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>): T",
        "identifier": "std::list::pop",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "pop;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Removes the last element from the specified list and returns it. The list will be modified.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Remove Last Item of ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Pop from List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/53",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list to remove the last item from.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/30",
            "identifier": "std::list::pop",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/31",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, item: T): NUMBER",
        "identifier": "std::list::push",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "push;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Adds a new element to the end of the list and returns the new length of the list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Push ${item} into ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Push to List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/54",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list to which an item will be added.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/55",
                    "identifier": "item",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Item",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The value to be added at the end of the list.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/31",
            "identifier": "std::list::push",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/32",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, item: T): LIST<T>",
        "identifier": "std::list::remove",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "remove;delete;strip;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Removes the first matching item from the given list and returns the resulting list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Remove ${item} from ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Remove from List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/56",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list from which the item will be removed.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/57",
                    "identifier": "item",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Item",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The item to remove from the list.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/32",
            "identifier": "std::list::remove",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/33",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>): LIST<T>",
        "identifier": "std::list::reverse",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "reverse;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new list with the elements of the input list in reverse order.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Reverse ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Reverse List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/58",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input list to be reversed.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/33",
            "identifier": "std::list::reverse",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/34",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>): NUMBER",
        "identifier": "std::list::size",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "size;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "This function returns the count of elements present in the given list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Size of ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "List Size",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/59",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The list whose number of elements is to be returned.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/34",
            "identifier": "std::list::size",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/35",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, comparator: COMPARATOR<T>): LIST<T>",
        "identifier": "std::list::sort",
        "displayIcon": "tabler:arrow-iteration",
        "aliases": [
            {
                "code": "en-US",
                "content": "sort;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new list with the elements sorted according to the comparator function provided.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Sort ${list} using ${comparator}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Sort List",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/60",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input list to be sorted.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/61",
                    "identifier": "comparator",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Comparator",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A function that takes two elements and returns a negative, zero, or positive number to indicate their ordering.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/35",
            "identifier": "std::list::sort",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/36",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>, comparator: COMPARATOR<T>): LIST<T>",
        "identifier": "std::list::sort_reverse",
        "displayIcon": "tabler:arrow-iteration",
        "aliases": [
            {
                "code": "en-US",
                "content": "sort_reverse;array;list;collection;std;sort;reverse",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new list with the elements sorted in descending order according to the comparator function provided.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Reversed-Sort ${list} using ${comparator}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Sort List in Reverse",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/62",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input list to be sorted in reverse order.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/63",
                    "identifier": "comparator",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Comparator",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "A function that takes two elements and returns a negative, zero, or positive number to indicate their ordering.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/36",
            "identifier": "std::list::sort_reverse",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/37",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(list: LIST<NUMBER>): NUMBER",
        "identifier": "std::list::sum",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "sum;total;add all;array;list;collection;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the total sum of the elements in the numeric list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Sum of ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Sum of Numbers",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/64",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Calculates the sum of all numbers in the given list.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/37",
            "identifier": "std::list::sum",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/38",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "<T>(list: LIST<T>): LIST<T>",
        "identifier": "std::list::to_unique",
        "displayIcon": "tabler:list",
        "aliases": [
            {
                "code": "en-US",
                "content": "to_unique;array;list;collection;std;to;unique",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new list containing only the unique elements from the input list.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Remove duplicates in ${list}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "To Unique",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/6",
            "identifier": "taurus-list"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/65",
                    "identifier": "list",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "List",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input list from which duplicates will be removed.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/38",
            "identifier": "std::list::to_unique",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/39",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::abs",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "absolute;abs;magnitude;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Removes the sign from the input number, returning its non-negative value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Absolute Value of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Absolute Value",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/66",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number Input",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the numeric input. The result will be its absolute (non-negative) value.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/39",
            "identifier": "std::number::abs",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/40",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(first: NUMBER, second: NUMBER): NUMBER",
        "identifier": "std::number::add",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "add;plus;sum;total;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Adds two numbers together.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Plus ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Add Numbers",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/67",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The first number to add.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/68",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The second number to add.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/40",
            "identifier": "std::number::add",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/41",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::arccos",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "arccos;acos;inverse cosine;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Computes the angle in radians whose cosine is the given number.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Arccosine of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Arccosine",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/69",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Calculates the arccosine (inverse cosine) of the input value.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/41",
            "identifier": "std::number::arccos",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/42",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::arcsin",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "arcsin;asin;inverse sine;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Computes the angle in radians whose sine is the given number.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Arcsine of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Arcsine",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/70",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Calculates the arcsine (inverse sine) of the input value.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/42",
            "identifier": "std::number::arcsin",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/43",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::arctan",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "arctan;atan;inverse tangent;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Computes the angle in radians whose tangent is the given number.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Arctangent of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Arctangent",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/71",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Calculates the arctangent (inverse tangent) of the input value.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/43",
            "identifier": "std::number::arctan",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/44",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(number: NUMBER): TEXT",
        "identifier": "std::number::as_text",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "to text;string;format number;number;math;std;as;text",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Converts a number into text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Convert ${number} to Text",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Number as Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/72",
                    "identifier": "number",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to convert to text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/44",
            "identifier": "std::number::as_text",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/45",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER, min: NUMBER, max: NUMBER): NUMBER",
        "identifier": "std::number::clamp",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "clamp;limit;bound;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the given number clamped between the minimum and maximum bounds.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Clamp ${value} between ${min} and ${max}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Clamp Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/73",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number Input",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input number that will be limited (clamped) to the specified range.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/74",
                    "identifier": "min",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Minimum",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The minimum allowed value in the clamping operation.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/75",
                    "identifier": "max",
                    "updatedAt": "2026-06-19T15:33:17Z",
                    "createdAt": "2026-06-19T15:33:17Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Maximum",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The maximum allowed value in the clamping operation.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/45",
            "identifier": "std::number::clamp",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/46",
        "createdAt": "2026-06-19T15:33:17Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(radians: NUMBER): NUMBER",
        "identifier": "std::number::cos",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "cos;cosine;trigonometry;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates the cosine value of the input angle measured in radians.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Cosine of ${radians}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Cosine",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/76",
                    "identifier": "radians",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Radians",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Computes the cosine of the given angle in radians.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/46",
            "identifier": "std::number::cos",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/47",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::cosh",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "cosh;hyperbolic cosine;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates the hyperbolic cosine (cosh) of the input value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Hyperbolic Cosine of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Hyperbolic Cosine",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/77",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number Input",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number for which to calculate the hyperbolic cosine.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/47",
            "identifier": "std::number::cosh",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/48",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(first: NUMBER, second: NUMBER): NUMBER",
        "identifier": "std::number::divide",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "divide;division;quotient;div;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the result of dividing the first numeric input (dividend) by the second (divisor).",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Divided by ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Divide Numbers",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/78",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Dividend",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the numerator or the number that will be divided by the second value.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/79",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Divisor",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the denominator or the value that divides the first number.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/48",
            "identifier": "std::number::divide",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/49",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(): NUMBER",
        "identifier": "std::number::euler",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "euler;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Provides the constant value of Euler's number, approximately 2.71828, which is the base of the natural logarithm.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Euler's Number",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Euler's Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/49",
            "identifier": "std::number::euler",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/50",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(base: NUMBER, exponent: NUMBER): NUMBER",
        "identifier": "std::number::exponential",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "exponential;exp;e power;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Computes the result of raising the base to the power specified by the exponent.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${base} to the Exponent of ${exponent}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Exponential",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/80",
                    "identifier": "base",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Base",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the numeric value that will be raised to the power of the exponent.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/81",
                    "identifier": "exponent",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Exponent",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This numeric value indicates the power to which the base is raised.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/50",
            "identifier": "std::number::exponential",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/51",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(text: TEXT): NUMBER",
        "identifier": "std::number::from_text",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "from text;parse;convert;number;math;std;from;text",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Attempts to parse the provided text input and return its numeric equivalent.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Convert ${text} to Number",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Number from Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/82",
                    "identifier": "text",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text string to convert to a number.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/51",
            "identifier": "std::number::from_text",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/52",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(number: NUMBER): BOOLEAN",
        "identifier": "std::number::has_digits",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "has;digits;contains;number;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Checks if the given number contains any digit characters",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Does ${number} have digits",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Has Digits in Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/83",
                    "identifier": "number",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number Input",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to check for digit characters.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/52",
            "identifier": "std::number::has_digits",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/53",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(first: NUMBER, second: NUMBER): BOOLEAN",
        "identifier": "std::number::is_equal",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "equal;equals;same;number;math;std;is",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the first number is equal to the second number, otherwise false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Equals ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Is Equal",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/84",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The first number to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/85",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The second number to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/53",
            "identifier": "std::number::is_equal",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/54",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(first: NUMBER, second: NUMBER): BOOLEAN",
        "identifier": "std::number::is_greater",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "greater;larger;more;number;math;std;is",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the first numeric input is greater than the second; otherwise, returns false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Is Greater than ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Is Greater",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/86",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the number that will be evaluated to determine if it is greater than the second number.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/87",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the number that the first number will be compared to.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/54",
            "identifier": "std::number::is_greater",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/55",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(first: NUMBER, second: NUMBER): BOOLEAN",
        "identifier": "std::number::is_less",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "less;smaller;fewer;number;math;std;is",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the first numeric input is less than the second; otherwise, returns false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Less than ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Is Less",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/88",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the number that will be evaluated to determine if it is less than the second number.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/89",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the number that the first number will be compared to.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/55",
            "identifier": "std::number::is_less",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/56",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER): BOOLEAN",
        "identifier": "std::number::is_positive",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "positive;greater than zero;number;math;std;is",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Evaluates the input number and returns true if it is positive (greater than zero), otherwise false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} Is Greater than 0",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Is Positive Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/90",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to check for positivity.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/56",
            "identifier": "std::number::is_positive",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/57",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER): BOOLEAN",
        "identifier": "std::number::is_zero",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "zero;equals zero;number;math;std;is",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the input number is zero. Otherwise returns false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} Equals 0",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Number Is Zero",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/91",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the numeric input evaluated to determine whether it equals zero.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/57",
            "identifier": "std::number::is_zero",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/58",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::ln",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "natural log;ln;log e;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates the natural logarithm (log base e) of a number.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Natural Logarithm of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Natural Logarithm",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/92",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The numeric input whose natural logarithm (log base e) will be calculated.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/58",
            "identifier": "std::number::ln",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/59",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(value: NUMBER, base: NUMBER): NUMBER",
        "identifier": "std::number::log",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "log;logarithm;log base;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates and returns the logarithm of a number with respect to a specified base.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Logarithm with Base ${base} of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Logarithm",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/93",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The numeric input whose logarithm is to be calculated.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/94",
                    "identifier": "base",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Base",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Specifies the logarithmic base to use (e.g., 10 for common log, e for natural log).",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/59",
            "identifier": "std::number::log",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/60",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(first: NUMBER, second: NUMBER): NUMBER",
        "identifier": "std::number::max",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "max;maximum;largest;greatest;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Compares two numbers and returns the maximum value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Maximum of ${first} and ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Maximum Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/95",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The first number to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/96",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The second number to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/60",
            "identifier": "std::number::max",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/61",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(first: NUMBER, second: NUMBER): NUMBER",
        "identifier": "std::number::min",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "min;minimum;smallest;least;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Compares two numbers and returns the minimum value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Minimum of ${first} and ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Minimum",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/97",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The first number to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/98",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The second number to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/61",
            "identifier": "std::number::min",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/62",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:01Z",
        "signature": "(first: NUMBER, second: NUMBER): NUMBER",
        "identifier": "std::number::modulo",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "modulo;mod;remainder;modulus;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Computes the modulus (remainder) of dividing the first numeric input by the second.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Modulus ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Modulo",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/99",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to apply the modulo operator onto.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/100",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Modulo",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The modulo operator.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/62",
            "identifier": "std::number::modulo",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/63",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(first: NUMBER, second: NUMBER): NUMBER",
        "identifier": "std::number::multiply",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "multiply;times;product;mul;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Takes two numeric inputs and returns their product.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Multiply by ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Multiply",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/101",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The first number to multiply.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/102",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second Number",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The second number to multiply.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/63",
            "identifier": "std::number::multiply",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/64",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::negate",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "negate;negative;invert;opposite;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the negation of a number (multiplies by -1).",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Negate ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Negate",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/103",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to negate.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/64",
            "identifier": "std::number::negate",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/65",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(): NUMBER",
        "identifier": "std::number::pi",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "pi;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Provides the constant value of pi, approximately 3.14159, used in many mathematical calculations.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Pi",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Pi",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/65",
            "identifier": "std::number::pi",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/66",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(min: NUMBER, max: NUMBER): NUMBER",
        "identifier": "std::number::random_number",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "random;rand;random number;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a randomly generated number within the given range, inclusive of both minimum and maximum.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Random Number Between ${min} and ${max}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Random Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/104",
                    "identifier": "min",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Minimum Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Defines the lower bound (inclusive) for the random number generation.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/105",
                    "identifier": "max",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Maximum Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Defines the upper bound (inclusive) for the random number generation.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/66",
            "identifier": "std::number::random_number",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/67",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(number: NUMBER): NUMBER",
        "identifier": "std::number::remove_digits",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "remove:digits;strip;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Removes all digit characters from the input number, effectively stripping it down to its non-digit components.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Remove Digits from ${number}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Remove Digits from Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/106",
                    "identifier": "number",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number Input",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the numeric input. The result will be its value without any digits.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/67",
            "identifier": "std::number::remove_digits",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/68",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER, root_exponent: NUMBER): NUMBER",
        "identifier": "std::number::root",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "root;nth root;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates the nth root of the input number, where n is specified by the root exponent.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${root_exponent} Root of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Root",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/107",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The numeric input for which the root will be calculated.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/108",
                    "identifier": "root_exponent",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Root Exponent",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The degree of the root to extract.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/68",
            "identifier": "std::number::root",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/69",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER, decimals: NUMBER): NUMBER",
        "identifier": "std::number::round",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "round;nearest;approximate;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Rounds a number to the nearest value at the specified number of decimal places.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Round ${value} with ${decimals} Decimal Places",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Round Number",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/109",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The numeric input that will be rounded to the nearest value.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/110",
                    "identifier": "decimals",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Decimal Places",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Specifies how many decimal digits to keep after rounding.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/69",
            "identifier": "std::number::round",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/70",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER, decimals: NUMBER): NUMBER",
        "identifier": "std::number::round_down",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "round down;floor;number;math;std;round;down",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Rounds a number downward to the specified number of decimal places.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Round Down ${value} with ${decimals} Decimal Places",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Round Number Down",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/111",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The numeric input that will be rounded downwards.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/112",
                    "identifier": "decimals",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Decimal Places",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Specifies how many decimal digits to keep after rounding down.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/70",
            "identifier": "std::number::round_down",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/71",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER, decimals: NUMBER): NUMBER",
        "identifier": "std::number::round_up",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "round up;ceil;ceiling;number;math;std;round;up",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Performs rounding on the given value, always rounding up to the nearest value at the given decimal precision.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Round Upwards ${value} with ${decimals} Decimal Places",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Round Up",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/113",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number Input",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to be rounded up.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/114",
                    "identifier": "decimals",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Decimal Places",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number of decimal places to round up to.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/71",
            "identifier": "std::number::round_up",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/72",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::sin",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "sin;sine;trigonometry;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates the sine of the input value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Sine of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Sine",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/115",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number Input",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number for which to calculate the sine.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/72",
            "identifier": "std::number::sin",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/73",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::sinh",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "sinh;hyperbolic sine;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates the hyperbolic sine (sinh) of the input value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Hyperbolic Sine of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Hyperbolic Sine",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/116",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Number Input",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number for which to calculate the hyperbolic sine.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/73",
            "identifier": "std::number::sinh",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/74",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::square",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "square;squared;power two;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the square of the given number.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} Squared",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Square",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/117",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to be squared.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/74",
            "identifier": "std::number::square",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/75",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: NUMBER): NUMBER",
        "identifier": "std::number::square_root",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "square root;sqrt;root;number;math;std;square",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates the positive square root of the input number.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Square Root of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Square Root",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/118",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to find the square root of.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/75",
            "identifier": "std::number::square_root",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/76",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(first: NUMBER, second: NUMBER): NUMBER",
        "identifier": "std::number::subtract",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "subtract;minus;difference;sub;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Subtracts the second number from the first number.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Minus ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Subtract",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/119",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Minuend",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number from which another number (the subtrahend) is to be subtracted.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/120",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Subtrahend",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The number to subtract from the first number (the minuend).",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/76",
            "identifier": "std::number::subtract",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/77",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(radians: NUMBER): NUMBER",
        "identifier": "std::number::tan",
        "displayIcon": "tabler:math-function",
        "aliases": [
            {
                "code": "en-US",
                "content": "tan;tangent;trigonometry;number;math;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Calculates the tangent value of the input angle measured in radians.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Tangent of ${radians}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Tangent",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/7",
            "identifier": "taurus-number"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/121",
                    "identifier": "radians",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Radians",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Computes the tangent of the given angle in radians.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/77",
            "identifier": "std::number::tan",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/78",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "<T>(object: OBJECT<T>, key: keyof OBJECT<T>): BOOLEAN",
        "identifier": "std::object::contains_key",
        "displayIcon": "tabler:cube",
        "aliases": [
            {
                "code": "en-US",
                "content": "contains_key;object;std;contains;key",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the given key is a property of the object; otherwise, returns false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Checks if ${object} Contains ${key}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Contains Key",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/8",
            "identifier": "taurus-object"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/122",
                    "identifier": "object",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Object",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The object to check for the presence of a key.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/123",
                    "identifier": "key",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Key",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The key to check for existence in the object.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/78",
            "identifier": "std::object::contains_key",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/79",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "<T, K extends keyof T>(object: OBJECT<T>, key: K): T[K]",
        "identifier": "std::object::get",
        "displayIcon": "tabler:cube",
        "aliases": [
            {
                "code": "en-US",
                "content": "get;object;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the value of a key inside of the object.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Get ${key} of ${object}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Get key of object",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/8",
            "identifier": "taurus-object"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/124",
                    "identifier": "object",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Object",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The object that contains the value referenced by the key.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/125",
                    "identifier": "key",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Key",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The property name under which the value will be referenced.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/79",
            "identifier": "std::object::get",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/80",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "<T>(object: OBJECT<T>): LIST<keyof OBJECT<T>>",
        "identifier": "std::object::keys",
        "displayIcon": "tabler:cube",
        "aliases": [
            {
                "code": "en-US",
                "content": "keys;object;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a list containing all keys of the specified object.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Keys of ${object}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Get Object Keys",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/8",
            "identifier": "taurus-object"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/126",
                    "identifier": "object",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Object",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Returns a list of all the keys (property names) of the given object.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/80",
            "identifier": "std::object::keys",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/81",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "<T, K extends TEXT, V>(object: OBJECT<T>, key: K, value: V): OBJECT<T & { [P in K]: V }>",
        "identifier": "std::object::set",
        "displayIcon": "tabler:cube",
        "aliases": [
            {
                "code": "en-US",
                "content": "set;object;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new object with the specified key set to the given value.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Set ${key} to ${value} of ${object}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Set Object Key",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/8",
            "identifier": "taurus-object"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/127",
                    "identifier": "object",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Object",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The original object that will be modified with the specified key-value pair.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/128",
                    "identifier": "key",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Key",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The property name under which the value will be stored in the object.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/129",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The value to assign to the object property identified by the key.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/81",
            "identifier": "std::object::set",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/82",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "<T>(object: OBJECT<T>): NUMBER",
        "identifier": "std::object::size",
        "displayIcon": "tabler:cube",
        "aliases": [
            {
                "code": "en-US",
                "content": "size;object;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns an integer count of all enumerable property keys in the specified object.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Size of ${object}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Get Object Size",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/8",
            "identifier": "taurus-object"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/130",
                    "identifier": "object",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Object",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Returns the number of keys present in the given object.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/82",
            "identifier": "std::object::size",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/83",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, suffix: TEXT): TEXT",
        "identifier": "std::text::append",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "append;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new text consisting of the original text followed by the specified suffix.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Append ${suffix} at the End of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Append Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/131",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Original Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The base text that will have another text appended to its end.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/132",
                    "identifier": "suffix",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Suffix",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text that will be appended to the end of the original text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/83",
            "identifier": "std::text::append",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/84",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): LIST<NUMBER>",
        "identifier": "std::text::as_bytes",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "as_bytes;text;string;std;as;bytes",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Converts a text into a list of byte values.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} As Bytes",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Text As Bytes",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/133",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Converts the input text into a list of byte values.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/84",
            "identifier": "std::text::as_bytes",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/85",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, index: NUMBER): TEXT",
        "identifier": "std::text::at",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "at;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Retrieves a single character from the input text based on the provided zero-based index.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Get Character of ${value} at ${index}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Character at Index",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/134",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input text from which a character will be retrieved by index.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/135",
                    "identifier": "index",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Index",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The zero-based position of the character to extract.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/85",
            "identifier": "std::text::at",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/86",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): NUMBER",
        "identifier": "std::text::byte_size",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "byte_size;text;string;std;byte;size",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Computes the size in bytes of the provided text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Byte-Size of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Byte Size",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/136",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text whose byte size is to be calculated.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/86",
            "identifier": "std::text::byte_size",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/87",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): TEXT",
        "identifier": "std::text::capitalize",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "capitalize;title case;upper first;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Converts the first character of the text to uppercase and leaves the rest unchanged.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Capitalize ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Capitalize",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/137",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Capitalizes the first letter of the input text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/87",
            "identifier": "std::text::capitalize",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/88",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): LIST<TEXT>",
        "identifier": "std::text::chars",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "characters;letters;split;text;string;std;chars",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Creates a list where each element is a single character from the original text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Turns ${value} into a List of Characters",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Characters",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/138",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Splits the input text into a list of its constituent characters.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/88",
            "identifier": "std::text::chars",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/89",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, substring: TEXT): BOOLEAN",
        "identifier": "std::text::contains",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "contains;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the subtext is found anywhere in the main text. Otherwise, returns false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Check if ${value} contains ${substring}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Contains Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/139",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The main text to search within.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/140",
                    "identifier": "substring",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Subtext",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text to search for inside the main text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/89",
            "identifier": "std::text::contains",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/90",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, encoding: TEXT_ENCODING): TEXT",
        "identifier": "std::text::decode",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "decode;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Decodes the input text from the specified encoding format.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Decode ${value} using ${encoding}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Decode Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/141",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text to decode.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/142",
                    "identifier": "encoding",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Encoding Type",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The decoding scheme to apply (e.g. Base64).",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/90",
            "identifier": "std::text::decode",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/91",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, encoding: TEXT_ENCODING): TEXT",
        "identifier": "std::text::encode",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "encode;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Transforms the given text into a representation encoded by the specified encoding scheme.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Encode ${value} to ${encoding}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Encode Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/143",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text to encode.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/144",
                    "identifier": "encoding",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Encoding Type",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The encoding scheme to apply (e.g., UTF-8, Base64).",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/91",
            "identifier": "std::text::encode",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/92",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, suffix: TEXT): BOOLEAN",
        "identifier": "std::text::ends_with",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "ends_with;text;string;std;ends;with",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the input text ends with the given suffix. Otherwise, returns false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Check if ${value} Ends With ${suffix}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Ends With",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/145",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input text to check.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/146",
                    "identifier": "suffix",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Suffix",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The suffix to test against the input text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/92",
            "identifier": "std::text::ends_with",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/93",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: LIST<NUMBER>): TEXT",
        "identifier": "std::text::from_ascii",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "from_ascii;text;string;std;from;ascii",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Converts a list of ASCII codes back into the corresponding text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} to Text",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Text from ASCII",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/147",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "ASCII Code",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "List of ASCII numeric codes representing characters.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/93",
            "identifier": "std::text::from_ascii",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/94",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): TEXT",
        "identifier": "std::text::hex",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "hex;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a text containing the hexadecimal values corresponding to each character of the input text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} to Hexadecimal",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Text to Hexadecimal",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/148",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text to be converted to its hexadecimal representation.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/94",
            "identifier": "std::text::hex",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/95",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, substring: TEXT): NUMBER",
        "identifier": "std::text::index_of",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "index_of;text;string;std;index;of",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the zero-based index of the first occurrence of the subtext in the text. Returns -1 if the subtext is not found.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Get Position of ${substring} Inside ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Index Of",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/149",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text to search within.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/150",
                    "identifier": "substring",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Subtext",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The subtext to find inside the text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/95",
            "identifier": "std::text::index_of",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/96",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, position: NUMBER, text: TEXT): TEXT",
        "identifier": "std::text::insert",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "insert;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new text where the provided text is inserted at the zero-based position index within the original text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Insert ${value} at ${position} into ${text}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Insert Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/151",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Original Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The original text into which another text will be inserted.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/152",
                    "identifier": "position",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Position",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Zero-based index indicating where the new text should be inserted.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/153",
                    "identifier": "text",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text to Insert",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text that will be inserted into the original text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [
                        {
                            "code": "en-US",
                            "content": "The subtext to be inserted at the specified position.",
                            "__typename": "Translation"
                        }
                    ],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/96",
            "identifier": "std::text::insert",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/97",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(first: TEXT, second: TEXT): BOOLEAN",
        "identifier": "std::text::is_equal",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "equal;equals;same;text;string;std;is",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Determines if the two given text inputs are exactly the same, returning true if equal, false otherwise.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${first} Equals ${second}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Is Equal",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/154",
                    "identifier": "first",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "First Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The first text to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/155",
                    "identifier": "second",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Second Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The second text to compare.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/97",
            "identifier": "std::text::is_equal",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/98",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): NUMBER",
        "identifier": "std::text::length",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "length;size;characters;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns the number of characters in the given text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Length of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Length",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/156",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Input text to determine the number of characters it contains.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/98",
            "identifier": "std::text::length",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/99",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): TEXT",
        "identifier": "std::text::lowercase",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "lowercase;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new text with all characters converted to lowercase.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} to Lowercase",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Text to Lowercase",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/157",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Converts all characters in the input text to lowercase.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/99",
            "identifier": "std::text::lowercase",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/100",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): TEXT",
        "identifier": "std::text::octal",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "octal;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Converts a text into an octal representation.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} to Octal",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Text to Octal",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/158",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Input Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text to be converted to its octal representation.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/100",
            "identifier": "std::text::octal",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/101",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, prefix: TEXT): TEXT",
        "identifier": "std::text::prepend",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "prepend;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new text consisting of the specified prefix followed by the original text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Prepend ${value} with ${prefix}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Prepend Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/159",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Original Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The base text that will have another text prepended to its beginning.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/160",
                    "identifier": "prefix",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Prefix",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The text that will be added to the start of the original text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/101",
            "identifier": "std::text::prepend",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/102",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, start: NUMBER, end: NUMBER): TEXT",
        "identifier": "std::text::remove",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "remove;delete;strip;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Removes the subtext between the specified start and end indices from the input text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Remove ${value} from ${start}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Remove String",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/161",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input text from which a subtext will be removed.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/162",
                    "identifier": "start",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Start Index",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The starting position for removing characters from the text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/163",
                    "identifier": "end",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "End Index",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The zero-based index where removal ends (exclusive).",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [
                        {
                            "code": "en-US",
                            "content": "The position just after the last character to be removed.",
                            "__typename": "Translation"
                        }
                    ],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/102",
            "identifier": "std::text::remove",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/103",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, oldText: TEXT, newText: TEXT): TEXT",
        "identifier": "std::text::replace",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "replace;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new text where every instance of the old subtext is replaced by the new subtext.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Replace ${old} with ${new} Inside ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Replace Subtext",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/164",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Original Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This is the text in which all occurrences of the old subtext will be replaced.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/165",
                    "identifier": "oldText",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Old Subtext",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "All occurrences of this subtext in the original text will be replaced.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/166",
                    "identifier": "newText",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "New Subtext",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This subtext will replace each occurrence of the old subtext.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/103",
            "identifier": "std::text::replace",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/104",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, oldText: TEXT, newText: TEXT): TEXT",
        "identifier": "std::text::replace_first",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "replace_first;text;string;std;replace;first",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Replaces the first occurrence of a specified subtext with another subtext in the input text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [
            {
                "code": "en-US",
                "content": "Returns a new text where only the first instance of the old subtext is replaced by the new subtext.",
                "__typename": "Translation"
            }
        ],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "In ${value} replace first ${old} with ${new}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Replace First Subtext",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/167",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Original Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This text contains the subtext that will be replaced only once—the first occurrence.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/168",
                    "identifier": "oldText",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Old Subtext",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Only the first occurrence of this subtext will be replaced in the original text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/169",
                    "identifier": "newText",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "New Subtext",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This subtext will replace only the first occurrence of the old subtext.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/104",
            "identifier": "std::text::replace_first",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/105",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, oldText: TEXT, newText: TEXT): TEXT",
        "identifier": "std::text::replace_last",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "replace_last;text;string;std;replace;last",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Replaces the last occurrence of a specified subtext with another subtext in the input text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "In ${value} replace the last ${old} with ${new}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Replace Last Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/170",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Original Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This text contains the subtext that will be replaced only once—the last occurrence.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/171",
                    "identifier": "oldText",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Old Subtext",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Only the last occurrence of this subtext will be replaced in the original text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/172",
                    "identifier": "newText",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "New Subtext",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "This subtext will replace only the last occurrence of the old subtext.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/105",
            "identifier": "std::text::replace_last",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/106",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): TEXT",
        "identifier": "std::text::reverse",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "reverse;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new text with the characters of the input text in reverse order.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Reverse ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Reverse Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/173",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input text to be reversed.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/106",
            "identifier": "std::text::reverse",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/107",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, delimiter: TEXT): LIST<TEXT>",
        "identifier": "std::text::split",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "split;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a list of subtext obtained by splitting the input text at each occurrence of the delimiter.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Splits ${value} on '${delimiter}'",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Split",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/174",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input text to be split.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/175",
                    "identifier": "delimiter",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Delimiter",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The delimiter text to split the text by.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/107",
            "identifier": "std::text::split",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/108",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT, prefix: TEXT): BOOLEAN",
        "identifier": "std::text::starts_with",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "text;string;std;start;with;starts",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns true if the input text begins with the given prefix. Otherwise, returns false.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Check if ${value} starts with ${prefix}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Starts With",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/176",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input text to check.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                },
                {
                    "id": "gid://sagittarius/ParameterDefinition/177",
                    "identifier": "prefix",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Prefix",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The prefix to test against the input text.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/108",
            "identifier": "std::text::starts_with",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/109",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): TEXT",
        "identifier": "std::text::swapcase",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "swapcase;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Converts uppercase letters to lowercase and lowercase letters to uppercase in the given text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Swapcase of ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Swap Case",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/178",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Swaps the case of each letter in the input text: uppercase letters become lowercase, and vice versa.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/109",
            "identifier": "std::text::swapcase",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/110",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): LIST<NUMBER>",
        "identifier": "std::text::to_ascii",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "to_ascii;text;string;std;to;ascii",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a list of numbers where each number represents the ASCII code of the corresponding character in the input text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "${value} To Ascii",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Text to ASCII",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/179",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Input text to convert to ASCII codes.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/110",
            "identifier": "std::text::to_ascii",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/111",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): TEXT",
        "identifier": "std::text::trim",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "trim;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Returns a new text with all leading and trailing whitespace characters removed from the input text.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Trim ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Trim Text",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/180",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "The input text from which leading and trailing whitespace characters will be removed.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/111",
            "identifier": "std::text::trim",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    },
    {
        "id": "gid://sagittarius/FunctionDefinition/112",
        "createdAt": "2026-06-19T15:33:18Z",
        "updatedAt": "2026-06-19T15:35:02Z",
        "signature": "(value: TEXT): TEXT",
        "identifier": "std::text::uppercase",
        "displayIcon": "tabler:abc",
        "aliases": [
            {
                "code": "en-US",
                "content": "uppercase;text;string;std",
                "__typename": "Translation"
            }
        ],
        "deprecationMessages": [],
        "descriptions": [
            {
                "code": "en-US",
                "content": "Transforms all letters in the text to their uppercase equivalents.",
                "__typename": "Translation"
            }
        ],
        "documentations": [],
        "displayMessages": [
            {
                "code": "en-US",
                "content": "Uppercase ${value}",
                "__typename": "Translation"
            }
        ],
        "names": [
            {
                "code": "en-US",
                "content": "Uppercase",
                "__typename": "Translation"
            }
        ],
        "runtime": {
            "id": "gid://sagittarius/Runtime/1",
            "__typename": "Runtime"
        },
        "runtimeModule": {
            "__typename": "RuntimeModule",
            "id": "gid://sagittarius/RuntimeModule/9",
            "identifier": "taurus-text"
        },
        "parameterDefinitions": {
            "nodes": [
                {
                    "id": "gid://sagittarius/ParameterDefinition/181",
                    "identifier": "value",
                    "updatedAt": "2026-06-19T15:33:18Z",
                    "createdAt": "2026-06-19T15:33:18Z",
                    "defaultValue": null,
                    "names": [
                        {
                            "code": "en-US",
                            "content": "Text Value",
                            "__typename": "Translation"
                        }
                    ],
                    "descriptions": [
                        {
                            "code": "en-US",
                            "content": "Converts all characters in the input text to uppercase.",
                            "__typename": "Translation"
                        }
                    ],
                    "documentations": [],
                    "__typename": "ParameterDefinition"
                }
            ],
            "__typename": "ParameterDefinitionConnection"
        },
        "runtimeFunctionDefinition": {
            "id": "gid://sagittarius/RuntimeFunctionDefinition/112",
            "identifier": "std::text::uppercase",
            "definitionSource": "",
            "version": "0.0.0",
            "runtime": {
                "id": "gid://sagittarius/Runtime/1",
                "__typename": "Runtime"
            },
            "__typename": "RuntimeFunctionDefinition"
        },
        "__typename": "FunctionDefinition"
    }
];