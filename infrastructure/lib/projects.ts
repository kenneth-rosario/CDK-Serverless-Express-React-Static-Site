import { BuildSpec, PipelineProject } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";


export class ReactProject extends PipelineProject {
    constructor(scope: Construct) {
        super(scope, 'ReactProject', {
            buildSpec: BuildSpec.fromObject({
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
            environment: {
                privileged: true,
            },
            buildSpec: BuildSpec.fromObject({
                version: 0.2,
                phases: {
                    install: {
                        runtime_versions: {
                            nodejs: "14.x"
                        },
                        commands: [
                            "npm run prep-install"
                        ]
                    },
                    build: {
                        commands: [
                            "cd ${CODEBUILD_SRC_DIR}",
                            "npm run build",
                            "npm run build-backend",
                            "npm run cdk synth"
                        ]
                    },
                    post_build: {
                        commands: [
                            "npm run cdk deploy InfraStack --require-approval=never --verbose"
                        ]
                    }
                }
            })
        })
    }
}
