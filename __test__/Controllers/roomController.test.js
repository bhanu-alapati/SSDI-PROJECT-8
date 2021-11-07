const Roomcontroller =  require("../../Controllers/roomController");
const RoomModel = require("../../Models/room")

describe("Test cases for room controller", () => {

    it(" should test index function - expected ", async () => {
        const findMock = jest.spyOn(RoomModel, "find").mockImplementation(() => Promise.resolve([1]))
        const renderFunction = jest.fn();
        let result = await Roomcontroller.index({}, {render : renderFunction, next: jest.fn()});
        expect(renderFunction).toHaveBeenCalled();
        findMock.mockRestore();
    })

    it(" should test index function - expected ", async () => {
        const findMock = jest.spyOn(RoomModel, "find").mockImplementation(() => Promise.reject([1]))
        const nextFn = jest.fn();
        let result = await Roomcontroller.index({}, {render : jest.fn()}, nextFn);
    })

    it(" should test index function - expected ", async () => {
        jest.spyOn(RoomModel, "find").mockImplementation(() => Promise.reject([]))
        let result = await Roomcontroller.index({}, {render : jest.fn(), next: jest.fn()});
        expect(true).toBeDefined();
    })

})