const db = require('./sqlite/database');

exports.getLeaderboard = async (req, res) => {
    const sql = 'SELECT * FROM leaderboard'
    db.all(sql, [], (err, rows) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ data: rows });
      })
}

exports.addToLeaderboard = async (req, res) => {
    const { user_id, avg_guess_time, accuracy } = req.body;
    const sql = `INSERT INTO leaderboard (user_id, avg_guess_time, accuracy) VALUES (?, ?, ?)`;
    const params = [user_id, avg_guess_time, accuracy];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Entry added to leaderboard successfully',
            data: {
                id: this.lastID,
                user_id,
                avg_guess_time,
                accuracy
            }
        });
    });
}