import Favor from './favor.model';

const favorService = {
    getAll: async function () {
        const favors = await Favor.find().exec();
        if (!favors) throw new Error(`Error getting favors`);
        return favors;
    }
}
export default favorService;