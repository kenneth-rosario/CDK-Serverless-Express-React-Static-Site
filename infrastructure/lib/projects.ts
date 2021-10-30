import { BuildSpec, PipelineProject } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";


export class ReactProject extends PipelineProject {
    constructor(scope: Construct) {
        super(scope, 'ReactProject', {
            buildSpec: BuildSpec.fromObject({
                version: 0.2,
                phases: {
                    install: {
                        "on-failure":"ABORT",
                        runtime_versions: {
                            nodejs: "14.x"
                        },
                        commands: [
                            "cd ${CODEBUILD_SRC_DIR}/frontend && npm install && cd ..", // frontend install
                        ]
                    },
                    build: {
                        "on-failure":"ABORT",
                        commands: [
                            "npm run build-frontend"
                        ]
                    }
                },
                artifacts:{
                    "base-directory":"${CODEBUILD_SRC_DIR}/frontend/out",
                    files: [
                        "**/*"
                    ]
                }
            })
        })
    }
}
