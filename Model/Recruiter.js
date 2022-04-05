const {connect, sql}= require('./connect');

exports.getProfile = async (req, res) => {
    console.log(req);
    const pool = await connect;
    const request = pool.request();

    //-------------------------- Get Recruiter Profile --------------------------------\\
    const result = await request.query(`SELECT * 
                                         FROM Recruiter
                                         WHERE Recruiter_ID='${req.user.user_id}'`);
    return result.recordset[0];
}

exports.updateProfile = async (req, res) => {
    const body = req.body;
    const user = req.user;

    const pool = await connect;
    const request = pool.request();

    //-------------------------- Recruiter --------------------------------\\
    let sqlString = `UPDATE Recruiter 
                     SET Recruiter_Name = N'${body['recruiter-name']}',
                         District = N'${body.district}',
                         City = N'${body.city}',
                         Tax = '${body.tax}'
                     WHERE Recruiter_ID = '${user.user_id}'`;
    await request.query(sqlString);
}

exports.createJob = async (req, res) => {
    const body = req.body;
    const user = req.user;

    const pool = await connect;
    const request = pool.request();
    let sqlString = '';

    //-------------------------- Recruiter_Job --------------------------------\\
    sqlString = `INSERT INTO Recruiter_Job (Recruiter_ID, Job_Name, Salary, Start_Date, End_date, District,
                                                City, Working_Form, Recruitment_Quantity, Status, Remote,
                                                Years_Of_Experience, Type_ID) 
                    VALUES(${user.user_id}, N'${body['job-name']}', '${body.salary}', '${body['start-date']}',
                     '${body['end-date']}', N'${body.district}', N'${body.city}', N'${body['working-form']}', 
                     '${body['recruitment_quantity']}', N'pending', '${body.remote}', '${body['years-of-experience']}',
                     '${body['type-id']}')
                    SELECT SCOPE_IDENTITY() AS Job_ID`;

    const result = await request.query(sqlString);
    const job_id = result.recordset[0].Job_ID;

    //------------------------- Description--------------------------------\\
    for(const description of body.description){
        await request.query(`INSERT INTO Description (Recruiter_Job_ID, Content)
                                  VALUES ('${job_id}', '${description}')`);
    }

    //-------------------------- Experience_Require --------------------------------\\
    for(const skill of body['skill-id']){
        await request.query(`INSERT INTO Experience_Require (Recruiter_Job_ID, Skill_ID)
                                  VALUES ('${job_id}', '${skill}')`);
    }
}

exports.updateJob = async (req, res) => {
    const job_id = req.params.jobId;
    const body = req.body;

    const pool = await connect;
    const request = pool.request();

    await request.query(`UPDATE Recruiter_Job 
                         SET Job_Name = N'${body['job-name']}',
                             Salary = '${body.salary}',
                             Start_Date = '${body['start-date']}',
                             End_Date = '${body['end-date']}',
                             District = N'${body.district}',
                             City = N'${body.city}',
                             Working_Form = N'${body['working-form']}',
                             Recruitment_Quantity = '${body['recruitment_quantity']}',
                             Remote = '${body.remote}',
                             Years_Of_Experience = '${body['years-of-experience']}',
                             Type_ID = '${body['type-id']}'
                         WHERE Recruiter_Job_ID = '${job_id}'`);

    //------------------------- Description--------------------------------\\
    await request.query(`DELETE FROM Description 
                         WHERE Recruiter_Job_ID = '${job_id}'`);

    for(const description of body.description){
        await request.query(`INSERT INTO Description (Recruiter_Job_ID, Content)
                                  VALUES ('${job_id}', '${description}')`);
    }

    //------------------------- Experience_Require --------------------------------\\
    await request.query(`DELETE FROM Experience_Require 
                         WHERE Recruiter_Job_ID = '${job_id}'`);

    for(const skill_id of body['skill-id']){
        await request.query(`INSERT INTO Experience_Require (Recruiter_Job_ID, Skill_ID)
                                        VALUES('${job_id}', '${skill_id}')`);
    }

}

exports.getCreatedJobs = async (req, res) => {
    const pool = await connect;
    const request = pool.request();

    const result = await request.query(`SELECT Recruiter.Recruiter_Name, Recruiter_Job.Recruiter_Job_ID,
                                               Recruiter_Job.Job_Name, Recruiter_Job.District,
                                               Recruiter_Job.city, Recruiter_Job.Salary,
                                               Recruiter_Job.Working_Form, Recruiter_Job.Start_Date, 
                                               Recruiter_Job.End_Date, Recruiter_Job.Status
                                  FROM Recruiter_Job join Recruiter on Recruiter_Job.Recruiter_ID = Recruiter.Recruiter_ID
                                  WHERE Recruiter.Recruiter_ID='${req.user.user_id}'`);
    return result.recordset;
}

exports.getJobDescription = async (req, res) => {
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
                                  WHERE Recruiter_ID='${req.user.user_id}'`);
    const recruiter = result.recordset[0];

    //-------------------------- Get Job Type --------------------------------\\
    result = await request.query(`SELECT Job.Job_Name, Job_Type.Type_Name
                                  FROM Job_Type join Job on Job_Type.Job_ID = Job.Job_ID
                                  WHERE Type_ID='${description.Type_ID}'`);
    const job_type = result.recordset[0];

    // //-------------------------- Skill requirement --------------------------------\\
    result = await request.query(`SELECT Skill.Skill_name
                                  FROM Experience_Require join Skill on Experience_Require.Skill_ID = Skill.Skill_ID
                                  WHERE Recruiter_Job_ID='${description.Recruiter_Job_ID}'`);
    const experience_require = result.recordset;

    // //-------------------------- Description --------------------------------\\
    result = await request.query(`SELECT Content
                                  FROM Description
                                  WHERE Recruiter_Job_ID='${description.Recruiter_Job_ID}'`);
    description.discription = result.recordset;

    return {description, recruiter, job_type, experience_require}
}

exports.getAppliedList = async (req, res) => {
    const job_id = req.params.jobId;

    const pool = await connect;
    const request = pool.request();

    const result = await request
        .query(`SELECT Candidate.Candidate_ID, Candidate.Candidate_Name, Candidate.Email,
                       Candidate.Phone_Number, Application.Apply_Time
                FROM (Application join Recruiter_Job on Application.Recruiter_Job_ID = Recruiter_Job.Recruiter_Job_ID)
                        join Candidate on Application.Candidate_ID = Candidate.Candidate_id
                WHERE Application.Recruiter_Job_ID='${job_id}'`);

    return result.recordset;
}

exports.getCandidateProfile = async (req, res) => {
    const candidate_id = req.params.candidateId;

    const pool = await connect;
    const request = pool.request();

    const result1 = await request.query(`SELECT * 
                                         FROM Candidate join Job on Candidate.Apply_Position = Job.Job_ID 
                                         WHERE Candidate_ID='${candidate_id}'`);
    const profile = result1.recordset[0];

    //-------------------------- Get Candidate_Skill --------------------------------\\
    const result2 = await request.query(`SELECT Candidate_Skill.Skill_ID, Skill.Skill_Name 
                                         FROM Candidate_Skill join Skill 
                                                       on Candidate_Skill.Skill_ID = Skill.Skill_ID 
                                         WHERE Candidate_Skill.Candidate_ID = '${candidate_id}'`);
    const skill = result2.recordset;

    //-------------------------- Get Candidate_Interest --------------------------------\\
    const result3 = await request.query(`SELECT Candidate_Interest.Interest_ID, Interest.Interest_Name 
                                         FROM Candidate_Interest join Interest 
                                                on Candidate_Interest.Interest_ID = Interest.Interest_ID 
                                         WHERE Candidate_Interest.Candidate_ID = '${candidate_id}'`);
    const interest = result3.recordset;

    return { profile, skill, interest}
}

exports.starCV = async (req, res) => {
    const pool = await connect;
    const request = pool.request();

    let result = await request
        .query(`SELECT Candidate.Candidate_ID, Candidate.Candidate_Name, Candidate.Email, Job.Job_Name
                FROM Candidate join Job on Candidate.Apply_Position = Job.Job_ID
                WHERE Candidate.Public_CV ='1'`);

    const candidates = result.recordset;

    for(const candidate of candidates){
        result = await request
            .query(`SELECT Skill.Skill_ID, Skill.Skill_Name
                FROM Skill join Candidate_Skill on Skill.Skill_ID = Candidate_Skill.Skill_ID
                WHERE Candidate_Skill.Candidate_ID = '${candidate.Candidate_ID}'`);
        candidate.skill = result.recordset;
    }

    return candidates;
}
