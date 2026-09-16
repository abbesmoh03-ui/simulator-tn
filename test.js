
var SV=[{n:'urp cod pilot',m:150},{n:'spy tool',m:100},{n:'site/foorweb',m:75},{n:'internet',m:60}];
var _pp=0, _rate=3.25, _sM=0;

window.addEventListener('DOMContentLoaded',function(){
  var d=new Date();
  document.getElementById('dt').textContent=d.toLocaleDateString('ar-TN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  rs();c();
});

function sw(t,b){
  document.querySelectorAll('.tbtn').forEach(function(x){x.classList.remove('on')});
  document.querySelectorAll('.sec').forEach(function(x){x.classList.remove('on')});
  b.classList.add('on');
  document.getElementById('sec-'+t).classList.add('on');
  c();
}

function rs(){
  var b=document.getElementById('sb');b.innerHTML='';
  SV.forEach(function(sv,i){
    var tr=document.createElement('tr');
    tr.innerHTML='<td><input type="text" value="'+sv.n+'" oninput="SV['+i+'].n=this.value" style="direction:rtl;text-align:right;background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:5px 9px;color:var(--white);font-size:.86rem;width:100%"></td>'
      +'<td><input type="number" value="'+sv.m+'" min="0" step="1" oninput="SV['+i+'].m=parseFloat(this.value)||0;c()"></td>'
      +'<td id="sp'+i+'" style="color:var(--teal);font-weight:700">&#8212;</td>'
      +'<td><button class="rmbtn" onclick="SV.splice('+i+',1);rs()">&#10005;</button></td>';
    b.appendChild(tr);
  });
  c();
}
function addS(){SV.push({n:'خدمة جديدة',m:0});rs();}

function g(id){return parseFloat(document.getElementById(id).value)||0;}
function s(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}

function c(){
  var rate=g('ex')||3.25;
  var dO=g('do')||10;
  var conf=g('cr')/100||0.7;
  var del=g('dr')/100||0.65;
  var buyU=g('bu'); var sellT=g('st');
  var dFee=g('df'); var pk=g('pk'); var ret=g('rc2'); var cpaU=g('cp2');
  var pfPct=g('pf')||0; // Payment Fee %
  // شحن الصين بالدولار محوّل + شحن الجزائر بالدينار — كلهم مع بعض
  var shipCN=(g('scn')+g('ecn'))*rate;
  var shipAL=g('sal')+g('eal');
  var shipT=shipCN+shipAL;
  var stEl=document.getElementById('ship-total');
  if(stEl)stEl.textContent=shipT.toFixed(2)+' TND (CN: '+shipCN.toFixed(2)+' + DZ: '+shipAL.toFixed(2)+')';
  var buyT=buyU*rate;
  var ci=buyT+shipT;
  var cf=del>0?ci/del:ci;
  var cpaT=cpaU*rate;
  var pfVal=sellT*(pfPct/100); // Payment Fee TND
  var mDel=dO*conf*del*30;
  var sM=0; SV.forEach(function(sv){sM+=sv.m;});
  var sP=mDel>0?sM/mDel:0;
  SV.forEach(function(sv,i){var e=document.getElementById('sp'+i);if(e)e.textContent=(mDel>0?(sv.m/mDel).toFixed(3):'0')+' TND';});
  s('stm',sM.toFixed(2)+' TND'); s('stp',sP.toFixed(3)+' TND');
  var tc=cf+dFee+pk+cpaT+sP+ret+pfVal;
  var gm=sellT-cf-dFee-pk-pfVal;
  var pp=sellT-tc;
  var pu=pp/rate;
  var dc=dO*conf*del;
  var dp=pp*dc;
  var mp=sellT>0?(pp/sellT)*100:0;
  // Save shared state
  _pp=pp; _rate=rate; _sM=sM;
  s('rp',rate.toFixed(2));
  // Payment Fee display
  var pfE=document.getElementById('pf-val');
  if(pfE)pfE.textContent=pfVal.toFixed(3)+' TND';
  s('k1',f2(buyT)+' TND'); s('k2',f2(shipT)+' TND'); s('k3',f2(ci)+' TND');
  s('k4',f2(cf)+' TND'); s('k5',f2(dFee+pk)+' TND'); s('k6',f2(cpaT)+' TND');
  s('k7',f2(sP)+' TND'); s('k8',f2(ret)+' TND');
  s('kpf',f2(pfVal)+' TND');
  s('k9',f2(tc)+' TND');
  var pe=document.getElementById('k10');
  pe.textContent=f2(pp)+' TND'; pe.style.color=pp>=0?'var(--green)':'var(--red)';
  cv('r1',f2(pp),pp); cv('r2',f4(pu),pp);
  s('r3',f2(gm)+' TND'); cv('r4',f2(dp),dp); s('r4c',dc.toFixed(1));
  s('r5',f2(cf)+' TND');
  var me=document.getElementById('r6'); me.textContent=mp.toFixed(1)+'%';
  me.style.color=mp>30?'var(--green)':mp>10?'var(--orange)':'var(--red)';
  su('sd',dp); su('sw',dp*7); su('sm',dp*30);
  su('r2d',dp); su('r2w',dp*7); su('r2m',dp*30);
  roi(_pp,_rate,_sM);
  cROI();
}

// ===== ROI INSTANT CALCULATOR =====
function cROI(){
  var rate=_rate||3.25;
  var mod=g('roi-mod'); // Modifier %
  // Cost: use manual override or base profit from calculator
  var costEl=document.getElementById('roi-cost');
  var cpaEl=document.getElementById('roi-cpa');
  var budEl=document.getElementById('roi-bud');
  var manualCost=costEl&&costEl.value!==''?parseFloat(costEl.value):null;
  var manualCpa=cpaEl&&cpaEl.value!==''?parseFloat(cpaEl.value):null;
  var budget=budEl&&budEl.value!==''?parseFloat(budEl.value):null;
  // Use manual or fall back to calculator values
  var pp=_pp*(1+mod/100); // apply modifier to profit per unit
  if(budget===null||manualCpa===null){
    // not enough data, show dashes
    s('ri-ords','—'); s('ri-pp',f2(pp)+' TND');
    s('ri-daily','—'); s('ri-weekly','—'); s('ri-monthly','—');
    return;
  }
  var svcDay=_sM/30;
  var ords=budget/manualCpa; // delivered orders from budget
  var adsCostTND=budget*rate;
  var netDay=(ords*pp)-adsCostTND-svcDay;
  s('ri-ords',ords.toFixed(1));
  cv('ri-pp',f2(pp),pp);
  cv('ri-daily',f2(netDay),netDay);
  cv('ri-weekly',f2(netDay*7),netDay);
  cv('ri-monthly',f2(netDay*30),netDay);
}

// ===== ROI MATRIX TABLE =====
var CPAS=[1,2,3,4,5,6,7,8,9,10];
var BUDS=[5,10,15,20,30,40,50,75,100,150,200];

function roi(pp,rate,sM){
  var t=document.getElementById('rtbl');
  var mod=g('roi-mod');
  var ppM=pp*(1+mod/100); // apply modifier to table too
  var cols=CPAS.slice().reverse();
  var h='<thead><tr><th class="hl2">Budget \\ CPA</th>';
  cols.forEach(function(x){h+='<th class="tc">'+x+'$</th>';});
  h+='</tr></thead><tbody>';
  var sd=sM/30;
  BUDS.forEach(function(b){
    h+='<tr><td class="bc">'+b+' $</td>';
    cols.forEach(function(cpa){
      var ords=b/cpa;
      var net=(ords*ppM)-(b*rate)-sd;
      var cl=net>ppM*5?'cp':net>0?'ck':net>-ppM*3&&ppM>0?'cw':'cl';
      if(ppM<=0&&net<=0)cl='cl';
      h+='<td class="'+cl+'">'+(net>0?'+':'')+Math.round(net)+'</td>';
    });
    h+='</tr>';
  });
  h+='</tbody>'; t.innerHTML=h;
}

function f2(n){return isNaN(n)?'—':n.toFixed(2);}
function f4(n){return isNaN(n)?'—':n.toFixed(4);}
function cv(id,val,num){
  var e=document.getElementById(id);if(!e)return;
  e.textContent=val;
  e.className='rv2 '+(num>0?'g':num<0?'r':'o');
}
function su(id,v){
  var e=document.getElementById(id);if(!e)return;
  e.textContent=Math.round(v).toLocaleString('fr-TN')+' TND';
  e.className='sa '+(v>0?'p':v<0?'n':'');
}

// Sourcing Calculator Logic
function cSrc(){
  var rTND=g('src-tnd-usd')||3.25;
  var rDZD=g('src-dzd-usd')||240;
  
  // Update DZD/TND Display
  var dzd_tnd = rDZD/rTND;
  s('src-dzd-tnd', dzd_tnd.toFixed(2));
  
  // Weight
  var wt = g('src-wt')||0;

  // My Costs ($)
  var my_p = g('src-p-my');
  var my_cn_kg = g('src-cn-my'); // price per kg
  var my_cn = my_cn_kg * wt;
  var my_tn_kg = g('src-tn-my'); // price per kg
  var my_tn = my_tn_kg * wt;
  var my_fee = g('src-fee-my'); 
  var my_total = my_p + my_cn + my_tn + my_fee;
  
  // Update UI Labels for My Costs
  var elLblCnMy = document.getElementById('lbl-cn-my'); if(elLblCnMy) elLblCnMy.innerHTML = `&#1578;&#1603;&#1604;&#1601;&#1577; &#1575;&#1604;&#1588;&#1581;&#1606; &#1604;&#1604;&#1581;&#1576;&#1577;: $${my_cn.toFixed(2)}`;
  var elLblTnMy = document.getElementById('lbl-tn-my'); if(elLblTnMy) elLblTnMy.innerHTML = `&#1578;&#1603;&#1604;&#1601;&#1577; &#1575;&#1604;&#1588;&#1581;&#1606; &#1604;&#1604;&#1581;&#1576;&#1577;: $${my_tn.toFixed(2)}`;

  // Client Prices ($)
  var cli_p = g('src-p-cli');
  var cli_cn_kg = g('src-cn-cli'); // price per kg
  var cli_cn = cli_cn_kg * wt;
  var cli_tn_kg = g('src-tn-cli'); // price per kg
  var cli_tn = cli_tn_kg * wt;
  var cli_fee = g('src-fee-cli');
  var cli_total = cli_p + cli_cn + cli_tn + cli_fee;

  // New Highlight for Client Price Per Item (TND and USD)
  var elCliTnd = document.getElementById('sm-c-cli-tnd');
  var elCliUsd = document.getElementById('sm-c-cli-usd');
  if(elCliTnd) elCliTnd.textContent = (cli_total * rTND).toFixed(2) + ' TND';
  if(elCliUsd) elCliUsd.textContent = '(' + cli_total.toFixed(2) + ' $)';

  // Update UI Labels for Client Costs
  var elLblCnCli = document.getElementById('lbl-cn-cli'); if(elLblCnCli) elLblCnCli.innerHTML = `&#1587;&#1593;&#1585; &#1575;&#1604;&#1588;&#1581;&#1606; &#1604;&#1604;&#1581;&#1576;&#1577;: $${cli_cn.toFixed(2)}`;
  var elLblTnCli = document.getElementById('lbl-tn-cli'); if(elLblTnCli) elLblTnCli.innerHTML = `&#1587;&#1593;&#1585; &#1575;&#1604;&#1588;&#1581;&#1606; &#1604;&#1604;&#1581;&#1576;&#1577;: $${cli_tn.toFixed(2)}`;
  
  // Stock & Delivery
  var qty = g('src-qty')||0;
  var dlv = g('src-dlv')||0;
  var paid = g('src-paid')||0;
  var rem = qty - dlv;
  
  var elRem = document.getElementById('src-rem');
  if(elRem) {
    elRem.textContent = rem;
    elRem.style.color = rem > 0 ? 'var(--red)' : 'var(--green)';
  }
  
  // Calculate Totals for Delivered Quantities
  // My Total Cost (for delivered items)
  var tot_my = my_total * dlv;
  // Total Billed to Client (for delivered items)
  var tot_cli = cli_total * dlv;
  
  // Client balance (how much client still owes for the DELIVERED items, or for total ordered? Usually we calculate balance on delivered)
  // Let's assume the user wants balance on the delivered stock they provided
  var balance = tot_cli - paid;
  var elBal = document.getElementById('src-balance');
  if(elBal){
    if(balance > 0) {
      elBal.innerHTML = `<span style="color:var(--orange)">&#9888;&#65039; &#1575;&#1604;&#1593;&#1605;&#1610;&#1604; &#1605;&#1586;&#1575;&#1604; &#1610;&#1587;&#1575;&#1604;&#1603;: <strong>$${balance.toFixed(2)}</strong></span>`;
    } else if (balance < 0) {
      elBal.innerHTML = `<span style="color:var(--green)">&#10004;&#65039; &#1575;&#1604;&#1593;&#1605;&#1610;&#1604; &#1583;&#1601;&#1593; &#1576;&#1586;&#1610;&#1575;&#1583;&#1577;: <strong>$${Math.abs(balance).toFixed(2)}</strong></span>`;
    } else {
      elBal.innerHTML = `<span style="color:var(--teal)">&#10004;&#65039; &#1582;&#1575;&#1604;&#1589;&#1610;&#1606; ($0)</span>`;
    }
  }

  // Update Summary Table (General)
  s('sm-c-my', `$${my_total.toFixed(2)}`);
  s('sm-c-cli', `$${cli_total.toFixed(2)}`);
  s('sm-tot-my', `$${tot_my.toFixed(2)}`);
  s('sm-tot-cli', `$${tot_cli.toFixed(2)}`);
  
  // Profit calculations
  var p_item_usd = cli_total - my_total;
  var p_tot_usd = p_item_usd * dlv;
  
  var roi_pct = my_total > 0 ? (p_item_usd / my_total) * 100 : 0;
  s('sm-roi', roi_pct.toFixed(1) + '%');
  
  // TND
  var p_item_tnd = p_item_usd * rTND;
  var p_tot_tnd = p_tot_usd * rTND;
  
  // DZD
  var p_item_dzd = p_item_usd * rDZD;
  var p_tot_dzd = p_tot_usd * rDZD;
  
  // Update UI - USD
  s('s-p-usd', p_item_usd.toFixed(2) + ' $');
  s('s-t-usd', p_tot_usd.toFixed(2) + ' $');
  
  // Update UI - TND
  s('s-p-tnd', p_item_tnd.toFixed(2) + ' TND');
  s('s-t-tnd', Math.round(p_tot_tnd).toLocaleString('fr-TN') + ' TND');
  
  // Update UI - DZD
  s('s-p-dzd', Math.round(p_item_dzd).toLocaleString('fr-DZ') + ' DZD');
  s('s-t-dzd', Math.round(p_tot_dzd).toLocaleString('fr-DZ') + ' DZD');
}


