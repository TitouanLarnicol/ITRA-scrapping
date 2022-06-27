export class MyError extends Error {
    errorId;
    status;
    constructor(error) {
        super(error.message);
        this.errorId = error.errorId;
        this.status = error.status;
    }
}