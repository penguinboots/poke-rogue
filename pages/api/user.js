import { PrismaClient } from '@prisma/client';
import achievements from '../../game/data/achievements.json'
import { unlockables } from '@/game/data/unlockableMoves';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // GET method acquires user data
  if (req.method === "GET") {
    const { auth0Sub } = req.query;

    try {
      const db_user = await prisma.user.findUnique({
        where: { auth0Sub },
      });

      if (!db_user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // find character
      const db_character = await prisma.character.findFirst({
        where: { userId: db_user.id },
      });

      // find achievements
      const db_achievements = await prisma.achievement.findMany({
        where: { userId: db_user.id },
      });

      // find moves
      const db_moves = await prisma.move.findMany({
        where: { userId: db_user.id },
      });

      res.status(200).json({
        db_user,
        db_character,
        db_achievements,
        db_moves,
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  }

  // POST method creates User 
  else if (req.method === 'POST') {
    const { user } = req.body;
    try {
      const db_user = await prisma.user.create({
        data: {
          auth0Sub: user.sub,
          email: user.email,
          name: user.name,
        },
      });

      //create character
      const db_character = await prisma.character.create({
        data:{
          move_1: "astonish",
          move_2: "quick-attack",
          userId: db_user.id
        }
      })

      //create achievements
      const db_achievements = []
      const achievementArray = Object.values(achievements)
      for (let i = 0; i < achievementArray.length; i++) {
        let achievement = achievementArray[i]
        const db_achievement = await prisma.achievement.create({
          data:{
            name: achievement.name,
            collected: achievement.collected,
            date_get: null,
            userId: db_user.id,
          },
        })
        db_achievements.push(db_achievement)
      };

      //create moves
      const db_moves = []
      for (let i = 0; i < unlockables.length; i++) {
        let move = unlockables[i];
        const db_move = await prisma.move.create({
          data: {
            name: move.name,
            collected: move.collected,
            date_get: null,
            userId: db_user.id,
          },
        });
        db_moves.push(db_move);
      }
      res.status(200).json({
        user: db_user,
        character: db_character,
        achievements: db_achievements,
        moves: db_moves,
      });    
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
}