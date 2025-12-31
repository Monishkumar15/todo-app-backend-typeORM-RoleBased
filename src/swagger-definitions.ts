/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user or admin
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in-progress, done]
 *               groupId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Task created
 */

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for current user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 */

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task by ID
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in-progress, done]
 *     responses:
 *       200:
 *         description: Task updated
 */

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task by ID
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Task deleted
 */

/**
 * @openapi
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created
 */

/**
 * @openapi
 * /api/groups:
 *   get:
 *     summary: Get all groups for current user
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 */

/**
 * @openapi
 * /api/groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     description: Get a specific group with its tasks. Only the group owner can access it.
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group fetched successfully
 *         
 *       401:
 *         description: Unauthorized
 *         
 *       403:
 *         description: Forbidden
 *         
 *       404:
 *         description: Group not found
 *         
 */


/**
 * @openapi
 * /api/groups/{id}:
 *   put:
 *     summary: Update group by ID
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group updated
 */

/**
 * @openapi
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete group by ID
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Group deleted
 */

/**
 * @openapi
 * /api/groups/{groupId}/tasks/{taskId}:
 *   post:
 *     summary: Add task to group
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Task added to group
 */

/**
 * @openapi
 * /api/groups/{groupId}/tasks/{taskId}:
 *   delete:
 *     summary: Remove task from group
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Task removed from group
 */
 
/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @openapi
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user overview by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: User details
 */

/**
 * @openapi
 * /api/admin/users/{id}/status:
 *   patch:
 *     summary: Update user status (active/deactivated)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
