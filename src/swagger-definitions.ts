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
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: USER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */


/**
 * @openapi
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
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
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
 * /api/groups/{fromGroupId}/move/{toGroupId}:
 *   post:
 *     summary: Move all tasks from one group to another
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: fromGroupId
 *         in: path
 *         required: true
 *         description: Source group ID (tasks will be moved from here)
 *         schema:
 *           type: number
 *       - name: toGroupId
 *         in: path
 *         required: true
 *         description: Destination group ID (tasks will be moved here)
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Tasks moved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fromGroup:
 *                   type: object
 *                   properties:
 *                     groupId:
 *                       type: number
 *                       example: 3
 *                     groupName:
 *                       type: string
 *                       example: Routine
 *                     tasks:
 *                       type: array
 *                       items: {}
 *                       example: []
 *                 toGroup:
 *                   type: object
 *                   properties:
 *                     groupId:
 *                       type: number
 *                       example: 8
 *                     groupName:
 *                       type: string
 *                       example: SUMMATION
 *                     tasks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           taskId:
 *                             type: number
 *                           taskTitle:
 *                             type: string
 *                           taskDescription:
 *                             type: string
 *                           taskStatus:
 *                             type: string
 *       400:
 *         description: Invalid operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               sameGroup:
 *                 value:
 *                   message: Source and destination groups must be different
 *               singleGroup:
 *                 value:
 *                   message: At least two groups are required to move tasks
 *               noTasks:
 *                 value:
 *                   message: Source group has no tasks to move
 *       403:
 *         description: Forbidden (accessing another user's group)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Forbidden
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Group not found
 */

/**
 * @openapi
 * /api/groups/{fromGroupId}/tasks/{taskId}/move/{toGroupId}:
 *   post:
 *     summary: Move a task from one group to another
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: fromGroupId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *       - name: toGroupId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Task moved successfully
 *       400:
 *         description: Invalid operation
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group or task not found
 */

/**
 * @openapi
 * /api/groups/{groupId}/tasks:
 *   delete:
 *     summary: Remove all tasks from a group
 *     description: >
 *       Removes all tasks from the specified group for the authenticated user.
 *       Tasks are not deleted; only the group association is removed.
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
 *     responses:
 *       200:
 *         description: All tasks removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupId:
 *                   type: number
 *                   example: 8
 *                 groupName:
 *                   type: string
 *                   example: SUMMATION
 *                 tasks:
 *                   type: array
 *                   example: []
 *       400:
 *         description: No tasks exist in this group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tasks in this group
 *       403:
 *         description: Forbidden - Group does not belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group not found
 *       500:
 *         description: Internal server error
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
