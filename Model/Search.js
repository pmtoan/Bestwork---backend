const {connect, sql}= require('./connect');

exports.search = async (req,res) => {
    const pool = await connect;
    const request = pool.request();

    const resultSet = [];
    let rs;
    
    if (!(req.query['job-name'] === '')) {
        rs = await request.query(`SELECT Recruiter_Job_ID FROM RECRUITER_JOB WHERE JOB_NAME LIKE N'%${req.query['job-name']}%'`);
        resultSet.push(rs.recordset);
    }
    if (!(req.query.district === '')) {
        rs = await request.query(`SELECT Recruiter_Job_ID FROM RECRUITER_JOB WHERE DISTRICT LIKE N'%${req.query.district}%'`);
        resultSet.push(rs.recordset);
    }
    if (!(req.query.city === '')) {
        rs = await request.query(`SELECT Recruiter_Job_ID FROM RECRUITER_JOB WHERE CITY LIKE N'%${req.query.city}%'`);
        resultSet.push(rs.recordset);
    }
    if (!(req.query.remote === '')) {
        rs = await request.query(`SELECT Recruiter_Job_ID FROM RECRUITER_JOB WHERE REMOTE LIKE N'%${req.query.remote}%'`);
        resultSet.push(rs.recordset);
    }
    if (!(req.query.salary[1] === '')) {
        rs = await request.query(`SELECT * FROM RECRUITER_JOB WHERE SALARY BETWEEN '${req.query.salary[0]}' AND '${req.query.salary[1]}'`);
        resultSet.push(rs.recordset);
    }


    let result = [];
    for (const rs of resultSet) {
        if(rs.length === 0){
            result = [];
            break;
        } else{
            if (result.length === 0) {
                for (const v of rs) {
                    result.push(v)
                }
                continue;
            }
            const t = []
            for (const v1 of result) {
                for (const v2 of rs) {
                    if (v1.Recruiter_Job_ID === v2.Recruiter_Job_ID) {
                        t.push(v1)
                    }
                }
            }
            result = t;
        }
    }

    const jobList = [];

    for(const ele of result){
        const sqlResult = await request
            .query(`SELECT Recruiter.Recruiter_Name, Recruiter_Job.Recruiter_Job_ID, Recruiter_Job.Job_Name,
                       Recruiter_Job.District, Recruiter_Job.city, Recruiter_Job.Salary, Recruiter_Job.Start_Date,
                       Recruiter_Job.End_Date, Recruiter_Job.Status, Recruiter_Job.Working_Form
                FROM Recruiter_Job join Recruiter on Recruiter_Job.Recruiter_ID = Recruiter.Recruiter_ID
                WHERE Recruiter_Job.Recruiter_Job_ID = '${ele.Recruiter_Job_ID}'`);
        jobList.push(sqlResult.recordset[0]) ;
    }

    return jobList;
}

