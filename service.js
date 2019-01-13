function create(db) {
  return {
    async getProjects(staffid) {
      const staffId = parseInt(staffid);

      try {
        const staff = await db.collection("contacts").findOne({ id: staffId });
        let projectCompanies = await db
          .collection("projects")
          .aggregate([
            { $match: { staffid: staffId } },
            {
              $lookup: {
                from: "companies",
                localField: "companyid",
                foreignField: "id",
                as: "company"
              }
            }
          ])
          .toArray();

        projectCompanies = projectCompanies.map(item => {
          item.company = item.company[0];
          return item;
        });

        return {
          staff,
          projectCompanies
        };
      } catch (error) {
        logger.error("Error occurred while getting data for staff", {
          errorData: err
        });
      }
    }
  };
}

module.exports = { create };
