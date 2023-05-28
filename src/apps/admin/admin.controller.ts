import { Response } from 'express';
import adminService from './admin.service';
import { RequestWithUser } from '../typescriptCrap/requestWithUser';

const adminController = {

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
            const data = await adminService.modifyFavor(req.body.userId, req.body.action);
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
    },
    getReports: async function (_: RequestWithUser, res: Response) {
        try{
            const reports = await adminService.getAllReports();
            res.status(200).send({
                message: 'Reports found',
                reports: reports,
            });
        } catch (error) {
            console.log('ERROR in getReports: ', error.message);
            return res.status(401).send({ message: error.message, error });
        }
    },

    controlReport: async function(req: RequestWithUser, res: Response){
        try{
            const result = await adminService.controlReports(req.body.report, req.body.action);
            return res.status(200).send({
                message: "Report managed",
                info: result,
            });
        }catch(error){
            console.log('ERROR in controlReport: ', error.message);
            return res.status(401).send({ message: error.message, error });
        }
    }

};

export default adminController;
