import { Router } from 'express';
import { createUser, loginUser, editUser, getUserById } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/edit/:id', editUser);


export default router;