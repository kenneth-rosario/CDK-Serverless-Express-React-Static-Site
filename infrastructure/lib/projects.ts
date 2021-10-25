import { BuildSpec, PipelineProject } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";


export class ReactProject extends PipelineProject {
    constructor(scope: Construct) {
        super(scope, 'ReactProject', {
            buildSpec: BuildSpec.fromObjectToYaml({
                version: 0.2,
                phases: {
                    install: {
                        runtime_versions: {
                            nodejs: "14.x"
                        },
                        commands: [
                            "cd ${CODEBUILD_SRC_DIR}/frontend && npm install && cd ..", // frontend install
                        ]
                    },
                    build: {
                        commands: [
                            "cd ${CODEBUILD_SRC_DIR}/frontend && npm run build && cd .."
                        ]
                    }
                },
                artifacts:{
                    files: [
                        "${CODEBUILD_SRC_DIR}/frontend/out/**/*"
                    ]
                }
            })
        })
    }
}


export class CdkProject extends PipelineProject {
    constructor(scope: Construct) {
        super(scope, 'CdkProject', {
            buildSpec: BuildSpec.fromObjectToYaml({
                version: 0.2,
                phases: {
                    install: {
                        runtime_versions: {
                            nodejs: "14.x"
                        },
                        commands: [
                            "npm install && cd ${CODEBUILD_SRC_DIR}/backend && npm install && cd .."
                        ]
                    },
                    build: {
                        commands: [
                            "cd ${CODEBUILD_SRC_DIR}",
                            "npm run build",
                            "npm run cdk synth"
                        ]
                    },
                },
                artifacts:{
                    files: [
                        "cdk.out/**/*",
                    ]
                }
            })
        })
    }
}