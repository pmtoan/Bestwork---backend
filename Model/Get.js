const {connect, sql}= require('./connect');

exports.getInterest = async () => {
    const pool = await connect;
    const request = pool.request();

    //-------------------------- Get Interest --------------------------------\\

    const result = await request.query(`SELECT * FROM Interest`);

    return result.recordset;
}

exports.getSkill = async () => {
    const pool = await connect;
    const request = pool.request();

    //-------------------------- Get Skill --------------------------------\\

    const result = await request.query(`SELECT * FROM Skill`);

    return result.recordset;
}

exports.getJob = async () => {
    const pool = await connect;
    const request = pool.request();

    //-------------------------- Get Job --------------------------------\\
    let result = await request.query(`SELECT * FROM Job`);

    const jobs = result.recordset;

    for(const job of jobs){
        result = await request.query(`SELECT Type_ID, Type_Name FROM Job_Type WHERE Job_ID='${job.Job_ID}'`);
        job.jobtype = result.recordset;
    }

    return jobs;
}