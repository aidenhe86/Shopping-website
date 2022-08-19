const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate",function(){
    test("works: accpet 1 data", ()=>{
        const result = sqlForPartialUpdate(
            {data1 :"updated data"},
            {data1 : "data_1" , data2: "data_2"});
        expect(result).toEqual({
            setCols: "\"data_1\"=$1",
            values:["updated data"]
        });
    })

    test("works: accpet 2 data",()=>{
        const result = sqlForPartialUpdate(
            {data1 :"updated data", data2:"another updated data"},
            {data1 : "data1" , data2: "data2"});
        expect(result).toEqual({
            setCols: "\"data1\"=$1, \"data2\"=$2",
            values:["updated data","another updated data"]
        })
    })
})

