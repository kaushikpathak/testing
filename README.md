

ProWorkFlow
===============

### About
This API is responsible to display projects for staff.

### Tech Stack
```
Framework: Node JS
Database: MongoDB
```

### Getting Started
```
Provide DB Details under Config folder (development.yml)
npm install
npm start
```

### 1. GET Project Details

```
 *   GET: /project/:staffid
 *     description: Get Projects by staffid
 *     produces:
 *       - application/json
 *     parameters:
 *         in: url
 *         name: staffid
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: bad request
 */
```