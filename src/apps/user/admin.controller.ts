import { Response } from 'express';
import adminService from './admin.service';
import { RequestWithUser } from '../typescriptCrap/requestWithUser';

const adminController = {
    admin: async function (req: RequestWithUser, res: Response) {
      try{
        const admin = await adminService.getAdminInfo(req.user.id);
        res.status(200).send({
            message: 'Admin found',
            user: req.user,
            admin: admin,
        });
      } catch (error) {
        console.log('ERROR in admin: ', error.message);
        return res.status(401).send({ message: error.message, error });
      }
    },

    getUsers: async function (_: RequestWithUser, res: Response) {
        try{
            const users = await adminService.allUsers();
            res.status(200).send({
                message: 'Users found',
                users: users,
            });
        } catch (error) {
            console.log('ERROR in getUsers: ', error.message);
            return res.status(401).send({ message: error.message, error });
        }
    },

    controlFavor: async function (req: RequestWithUser, res: Response) {
        try{
            const data = await adminService.modifyFavor(req.body.favorId, req.body.action);
            res.status(200).send({
                message: 'Favor modified',
                data: data,
            });
        } catch (error) {
            console.log('ERROR in controlFavor: ', error.message);
            return res.status(401).send({ message: error.message, error });
        }
    },

    statistics: async function (_: RequestWithUser, res: Response) {
        try{
            const data = await adminService.data();
            res.status(200).send({
                message: 'Statistics found',
                data: data,
            });
        } catch (error) {
            console.log('ERROR in statistics: ', error.message);
            return res.status(401).send({ message: error.message, error });
        }
    }

};

export default adminController;
