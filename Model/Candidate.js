const {connect, sql}= require('./connect');

exports.getProfile = async (req, res) => {
    const candidate_id = req.user.user_id;

    const pool = await connect;
    const request = pool.request();

    //-------------------------- Get Candidate Profile --------------------------------\\
    const result1 = await request.query(`SELECT * 
                                         FROM Candidate
                                         WHERE Candidate_ID='${candidate_id}'`);
    const profile = result1.recordset[0];

    //-------------------------- Get Job Position --------------------------------\\
    const result2 = await request.query(`SELECT Job.Job_ID, Job.Job_Name 
                                         FROM Candidate join Job on Candidate.Apply_Position = Job.Job_ID 
                                         WHERE Candidate_ID='${candidate_id}'`);
    const apply_position = result2.recordset[0];

    //-------------------------- Get Candidate_Skill --------------------------------\\
    const result3 = await request.query(`SELECT Candidate_Skill.Skill_ID, Skill.Skill_Name 
                                         FROM Candidate_Skill join Skill 
                                                       on Candidate_Skill.Skill_ID = Skill.Skill_ID 
                                         WHERE Candidate_Skill.Candidate_ID = '${candidate_id}'`);
    const skill = result3.recordset;

    //-------------------------- Get Candidate_Interest --------------------------------\\
    const result4 = await request.query(`SELECT Candidate_Interest.Interest_ID, Interest.Interest_Name 
                                         FROM Candidate_Interest join Interest 
                                                on Candidate_Interest.Interest_ID = Interest.Interest_ID 
                                         WHERE Candidate_Interest.Candidate_ID = '${candidate_id}'`);
    const interest = result4.recordset;

    return {
        profile,
        apply_position,
        skill,
        interest
    }
}

exports.updateProfile = async (req, res) =>     {
    const body = req.body;
    const user = req.user;
    const skill_IDs = body['skill-id'];

    const candidate_id = user.user_id;

    const pool = await connect;
    const request = pool.request();

    //-------------------------- Candidate --------------------------------\\
    let sqlString = `UPDATE Candidate 
                     SET Candidate_Name = N'${body['candidate-name']}',
                         Date_Of_Birth = '${body['date-of-birth']}',
                         Gender = '${body.gender}',
                         Phone_Number = '${body['phone-number']}',
                         About = N'${body.about}',
                         Apply_Position = '${body['apply-position']}',
                         Working_Form = N'${body['working-form']}',
                         Created_Date = CURRENT_TIMESTAMP
                     WHERE Candidate_ID = '${candidate_id}'`;
    await request.query(sqlString);

    //-------------------------- Candidate_Interest --------------------------------\\
    await request.query(`DELETE FROM Candidate_Interest WHERE Candidate_ID='${candidate_id}'`);

    for(const interest_id of body['interest-id']){
        await request.query(`INSERT INTO Candidate_Interest (Interest_ID, Candidate_ID)
                        VALUES('${interest_id}', '${candidate_id}')`);
    }

    //-------------------------- Candidate_Skill --------------------------------\\
    await request.query(`DELETE FROM Candidate_Skill WHERE Candidate_ID='${candidate_id}'`);

    for(let i=0; i<skill_IDs.length; i++){
        await request.query(`INSERT INTO Candidate_Skill (Skill_ID, Candidate_ID, Rank)
                        VALUES('${skill_IDs[i]}', '${candidate_id}', '${body.rank[i]}')`);
    }
}

exports.setPublic = async (req, res) => {
    const pool = await connect;
    const request = pool.request();

    //-------------------------- Candidate --------------------------------\\
    let sqlString = `UPDATE Candidate 
                     SET Public_CV = '${req.body['public-cv']}'
                     WHERE Candidate_ID = '${req.user.user_id}'`;
    await request.query(sqlString);
}

exports.apply = async (req, res) => {
    const pool = await connect;
    const request = pool.request();

    await request.query(`INSERT INTO Application (Recruiter_Job_ID, Candidate_ID, Apply_Time)
                         VALUES ('${req.body['recruiter-job-id']}', '${req.user.user_id}', CURRENT_TIMESTAMP)`);
}

exports.appliedList = async(req,res) => {
    const candidate_id = req.user.user_id;
    const pool = await connect;
    const request = pool.request();

    const result = await request
        .query(`SELECT Recruiter.Recruiter_Name, Recruiter_Job.Job_Name, Recruiter_Job.District,
                       Recruiter_Job.city, Recruiter_Job.Salary, Recruiter_Job.Start_Date, 
                       Recruiter_Job.End_Date, Recruiter_Job.Status
                FROM (Recruiter_Job join Application on Recruiter_Job.Recruiter_Job_ID = Application.Recruiter_Job_ID)
                      join Recruiter on Recruiter_Job.Recruiter_ID = Recruiter.Recruiter_ID
                WHERE Application.Candidate_ID='${candidate_id}'`);

    return result.recordset;
}

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
