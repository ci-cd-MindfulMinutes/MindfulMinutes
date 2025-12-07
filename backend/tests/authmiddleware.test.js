jest.setTimeout(30000);

const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authmiddleware");

process.env.JWT_SECRET = "testsecret123";

describe("Auth Middleware Unit Test", () => {

  it("Should allow request with valid token", () => {
    const token = jwt.sign({ userId: "12345" }, process.env.JWT_SECRET);

    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${token}`)
    };

    const res = {};
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toHaveProperty("userId", "12345");
    expect(next).toHaveBeenCalled();
  });

  it("Should reject request without token", () => {
    const req = {
      header: jest.fn().mockReturnValue(undefined)
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. No token provided."
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("Should reject invalid token", () => {
    const req = {
      header: jest.fn().mockReturnValue("Bearer invalidtoken")
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid token."
    });
    expect(next).not.toHaveBeenCalled();
  });

});
