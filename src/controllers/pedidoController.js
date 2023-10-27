function pedido(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status=d.id_status WHERE b.id_status=1', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      //console.log("----pendientes----",pedi)
      res.render('pages/pedidos', { pedi });
    });
  });
}

function terminado(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status = d.id_status WHERE  b.id_status = 2', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      //console.log("--------",pedi)
      res.render('pages/terminado', { pedi });
    });
  });
}

function pagado(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status = d.id_status WHERE b.id_status = 3', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      //console.log("--------",pedi)
      res.render('pages/pagado', { pedi });
    });
  });
}

function entregado(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status = d.id_status WHERE b.id_status = 4', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      //console.log("--------",pedi)
      res.render('pages/entregado', { pedi });
    });
  });
}



function detalle(req, res) {
  const datos=req.body;
  //console.log("------folio-----",datos);
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio FROM pedido, a.id_producto b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[datos.folio], (err, deta) => {
      if(err) {
        res.json(err);
      }
      //console.log("----detalles----", deta);
      var stat = deta[0].id_status;
      res.render('pages/detalle', {deta});
    })
  })
}

function detalle_e(req, res) {
  const datos=req.body;
  //console.log("------folio-----",datos);
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio, a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[datos.folio], (err, deta) => {
      if(err) {
        res.json(err);
      }
      //console.log("----detalles----", deta);
      res.render('pages/detalle_e', {deta, folio:datos.folio});
    })
  })
}

function detalle_agr(req, res) {
  const datos=req.body;
  //console.log("------folio-----",datos);
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio, a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[datos.folio], (err, deta) => {
      if(err) {
        res.json(err);
      }
      //console.log("----detalles----", deta);
      res.render('pages/detalle_agrega', {deta, folio:datos.folio});
    })
  })
}

function marca (req, res) {
  const data = req.body;
  //console.log("Folio:",data.folio);
  req.getConnection((err, conn) =>{
    conn.query('UPDATE pedido SET id_status=id_status+1 where folio = ? ',[data.folio[0]], (err, pers) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/');
    })
  })
}

module.exports = {
 detalle:detalle,
 detalle_e:detalle_e,
 detalle_agr,
 pedido,
 marca,
 terminado,
 pagado,
 entregado,
}