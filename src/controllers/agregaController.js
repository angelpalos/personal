function buscar(req, res){
    const data = req.body;
    const folio = req.body.folio;
    const busc = '%'+ data.buscador + '%'
    //console.log(busc);
    //console.log(folio);
    req.getConnection((err, conn)=>{
      conn.query("SELECT a.name,a.precio,a.id_producto,a.costo, b.folio from product a join pedido b ON b.folio=? WHERE a.name LIKE ? ORDER BY a.name ASC;", [folio,busc], (err, pers) => {
        if(err){
            res.json(err);
        }
        //console.log(data.buscador)
        //console.log(err)
        //console.log(pers)
        res.render('pages/agregar', {pers, folio:folio})
    
      });
    });
}

function indexp(req, res) {
    const folio = req.body.folio;
    console.log(folio[0]);
    req.getConnection((err, conn) => {
      conn.query('SELECT a.name,a.precio,a.id_producto,a.costo, b.folio from product a join pedido b ON b.folio=? ORDER BY `name` ASC',[folio[0]],(err, pers) => {
        
        console.log("Productos: ",pers)
        res.render('pages/agregar', { pers, folio:folio[0]});
      });
    });
}

function agrega(req,res) {
    const data = req.body;
    //console.log('body', data);
    req.getConnection((err, conn) => {
        conn.query('select id_producto, precio, name from product where id_producto=?',[data.id_producto],(err,prod) => {
            //console.log('info producto',prod);
            conn.query('select cantidad from detalle where id_producto=? and folio=?',[data.id_producto,data.folio],(err,rows)=>{
                if(rows.length > 0){
                    const cant = rows[0].cantidad + 1;
                    conn.query('update detalle set cantidad = ? where id_producto=? and folio=?',[cant, data.id_producto, data.folio],(err,agr)=>{
                        if(err){
                            res.json(err);
                        }
                    })
                }else{
                    conn.query('INSERT INTO detalle (folio ,cantidad, id_producto, precio, name) values (?, ?, ?, ?, ?)',[data.folio, 1,prod[0].id_producto, prod[0].precio, prod[0].name],(err,agr)=>{
                        if(err){
                            res.json(err);
                        }
                    })
                }
                conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[data.folio], (err, deta) =>{
                    res.render('pages/detalle_agrega',{deta, folio: data.folio});
                })
            })
        })
    })
}

//res.render('pages/detalle_agrega',{deta});

module.exports = {
    buscar,
    indexp:indexp,
    agrega
}