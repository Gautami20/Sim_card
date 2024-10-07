const express = require('express');
const bodyParser=require('body-parser');  
const{Pool}= require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: 'gautamigupta',
    host: 'localhost',
    database: 'sim_cards',
    password: 'password',
    port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.send('index.js');
}
)

app.post('/activate', async (req, res) => {
    const sim_number = req.body;

    try {
        const result = await pool.query(
            `UPDATE sim_cards SET status = 'active', activation_date = NOW() WHERE sim_number = $1  RETURNING *`, [sim_number]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'SIM card not found.' });
        }

        res.status(200).json(result.rows[0]);
        res.send('index.js');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
        res.send("index.js", sim_number);
    }
});
app.post('/deactivate', async(req, res) => {
    const sim_number=req.body;
    try{
        await pool.query("UPDATE sim_cards status='inactive' WHERE sim_number=$1 RETURNING *",[sim_number]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'SIM card not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });}
});
app.get('/sim-details/:simNumber', async (req, res) => {
    const { simNumber } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM sim_cards WHERE sim_number = $1`, 
            [simNumber]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'SIM card not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.listen(PORT,()=>{
    console.log(`Post running on http://localhost:${PORT}`);
});