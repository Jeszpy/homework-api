import {Router} from "express";
import {ioc} from "../IoCContainer";
import {TYPES} from "../types/ioc";
import {TestingController} from "../presentation/TestingController";


export const testingRouter = Router({})

const testingController = ioc.get<TestingController>(TYPES.TestingController)
const wipeAllDataFromCollections = testingController.wipeAllDataFromCollections.bind(testingController)


testingRouter
    .delete('/all-data', wipeAllDataFromCollections)