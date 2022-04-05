const {connect, sql}= require('./connect');

exports.jobList = async (req,res) => {
    const pool = await connect;
    const request = pool.request();

    const result = await request
        .query(`SELECT Recruiter.Recruiter_Name, Recruiter_Job.Recruiter_Job_ID, Recruiter_Job.Job_Name, 
                       Recruiter_Job.District, Recruiter_Job.city, Recruiter_Job.Salary, Recruiter_Job.Start_Date, 
                       Recruiter_Job.End_Date, Recruiter_Job.Status, Recruiter_Job.Working_Form
                FROM Recruiter_Job join Recruiter on Recruiter_Job.Recruiter_ID = Recruiter.Recruiter_ID
                WHERE Recruiter_Job.Status = 'available'`);
    return result.recordset;
}

exports.jobDescription = async (req, res) => {
    const job_id = req.params.jobId;

    const pool = await connect;
    const request = pool.request();

    let result =  null;

    //-------------------------- Get Recruiter Job --------------------------------\\
    result = await request.query(`SELECT * 
                                  FROM Recruiter_Job
                                  WHERE Recruiter_Job_ID='${job_id}'`);
    const description = result.recordset[0];

    //-------------------------- Get Recruiter  --------------------------------\\
    result = await request.query(`SELECT * 
                                  FROM Recruiter
                                  WHERE Recruiter_ID='${description.Recruiter_ID}'`);
    const recruiter = result.recordset[0];

    //-------------------------- Get Job Type --------------------------------\\
    result = await request.query(`SELECT Job.Job_Name, Job_Type.Type_Name
                                  FROM Job_Type join Job on Job_Type.Job_ID = Job.Job_ID
                                  WHERE Type_ID='${description.Type_ID}'`);
    const job_type = result.recordset[0];

    //-------------------------- Skill requirement --------------------------------\\
    result = await request.query(`SELECT Skill.Skill_name
                                  FROM Experience_Require join Skill on Experience_Require.Skill_ID = Skill.Skill_ID
                                  WHERE Recruiter_Job_ID='${description.Recruiter_Job_ID}'`);
    const experience_require = result.recordset;
    //------------------------- Description --------------------------------\\
    result = await request.query(`SELECT Content
                                  FROM Description
                                  WHERE Recruiter_Job_ID='${description.Recruiter_Job_ID}'`);
    description.discription = result.recordset;

    return {description, recruiter, job_type, experience_require}

}
