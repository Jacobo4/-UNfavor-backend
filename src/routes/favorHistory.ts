import express, { Request, Response } from 'express';

const Favor = require('../models/favor');
//Favores completados
router.get('/completed_favors/:user_id', async (req: Request, res: Response) => {
  try {
    const completed_favors = await Favor.find({
      $and: [
        { favor_state: 'completed' },
        { $or: [{ user_published_id: req.params.user_id }, { user_accepted_id: req.params.user_id }] }
      ]
    }).populate('user_published_id', 'name').populate('user_accepted_id', 'name');
    res.status(200).json(completed_favors);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;