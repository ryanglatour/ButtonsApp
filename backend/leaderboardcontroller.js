const db = require('./sqlite/database');

exports.getLeaderboard = async (req, res) => {
    const { tag } = req.body
    const sql = `SELECT * FROM leaderboard WHERE tag = ?`
    db.all(sql, [tag], (err, rows) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ data: rows });
      })
}

exports.addToLeaderboard = async (req, res) => {
    const { user_id, avg_guess_time, accuracy, tag } = req.body;
    const sql = `INSERT INTO leaderboard (user_id, avg_guess_time, accuracy, tag) VALUES (?, ?, ?, ?)`;
    const params = [user_id, avg_guess_time, accuracy, tag];

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
                accuracy,
                tag
            }
        });
    });
}