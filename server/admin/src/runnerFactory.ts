/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as services from "@prague/services";
import { promiseTimeout } from "@prague/services-client";
import * as core from "@prague/services-core";
import * as utils from "@prague/services-utils";
import { Provider } from "nconf";
import * as winston from "winston";
import { KeyValueManager } from "./keyValueManager";
import { AdminRunner } from "./runner";
import { IWebServerFactory, WebServerFactory } from "./webServer";

export class AdminResources implements utils.IResources {
    public webServerFactory: IWebServerFactory;

    constructor(
        public config: Provider,
        public mongoManager: core.MongoManager,
        public keyValueManager: KeyValueManager,
        public port: any) {

        this.webServerFactory = new WebServerFactory();
    }

    public async dispose(): Promise<void> {
        await this.mongoManager.close();
    }
}

export class AdminResourcesFactory implements utils.IResourcesFactory<AdminResources> {
    public async create(config: Provider): Promise<AdminResources> {

        // Database connection
        const mongoUrl = config.get("mongo:endpoint") as string;
        const mongoFactory = new services.MongoDbFactory(mongoUrl);
        const mongoManager = new core.MongoManager(mongoFactory);

        let keyValueManager: KeyValueManager;
        try {
            keyValueManager = await promiseTimeout(15000, KeyValueManager.load(config));
        } catch (err) {
            winston.error(`key-value load error`);
            winston.error(err);
        }

        // This wanst to create stuff
        const port = utils.normalizePort(process.env.PORT || "3000");

        return new AdminResources(
            config,
            mongoManager,
            keyValueManager,
            port);
    }
}

export class AdminRunnerFactory implements utils.IRunnerFactory<AdminResources> {
    public async create(resources: AdminResources): Promise<utils.IRunner> {
        return new AdminRunner(
            resources.webServerFactory,
            resources.config,
            resources.port,
            resources.mongoManager,
            resources.keyValueManager);
    }
}
