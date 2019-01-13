
function create(db){
    return {
        async getProjects(staffid){
            staffid = parseInt(staffid); // using regex of better option

            try {
                const staff =  await db.collection('contacts').findOne({id:staffid});
                let projectCompanies = await db.collection('projects').aggregate([
                        {$match:{"staffid" : staffid}},
                        {
                            $lookup:{
                                from: "companies",
                                localField: "companyid",
                                foreignField: "id",
                                as: "company"
                            }
                        }
                    ]).toArray();

                projectCompanies  = projectCompanies.map(item=>{
                    item.company = item.company[0];
                    return item;
                });

                console.log(projectCompanies);  
                
                return {
                    staff,
                    projectCompanies
                }

            } catch (error) {
                console.log('error', error);
            }
            
            // await db.collection('').find();
            // await db.collection('Projects').find();
        }
    }
}

module.exports = { create }