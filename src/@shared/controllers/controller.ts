import express from "express";

export default abstract class Controller {
    abstract router: express.Router;
    abstract initializeRoutes(): void;
}