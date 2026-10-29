(function(){
  var $=function(id){return document.getElementById(id)};
  var RATE={Health:.025,Motor:.03,Life:.012,Home:.004};
  var COVER={
    Health:["Hospitalisation including room rent and ICU charges","Pre and post hospitalisation expenses (30 / 60 days)","Day-care procedures and ambulance charges","Annual preventive health check-up"],
    Motor:["Own damage from accident, fire, theft or natural calamity","Third-party liability as required by law","Personal accident cover for the owner-driver","Roadside assistance and towing"],
    Life:["Death benefit paid to the nominee","Accidental death rider","Terminal illness benefit","Waiver of premium on disability"],
    Home:["Fire, lightning, explosion and flood damage to the structure","Burglary and theft of household contents","Alternative accommodation expenses","Public liability cover"]
  };
  var LABEL={Health:"Health",Motor:"Motor vehicle",Life:"Life",Home:"Home"};
  var PLACEHOLDER={Health:"Add-ons (optional), e.g. maternity",Motor:"Vehicle make, model and registration no.",Life:"Occupation",Home:"Property address and construction type"};
  var DEFAULTS={Health:"Maternity cover",Motor:"Hyundai i20, TS 09 AB 1234",Life:"Software engineer",Home:"2BHK apartment, RCC construction"};
  var mode="cert", polNo=makeNo();

  function makeNo(){
    var t=$("type")?$("type").value:"Health";
    return t.slice(0,2).toUpperCase()+"-"+new Date().getFullYear()+"-"+String(Math.floor(Math.random()*900000)+100000);
  }
  function esc(s){var d=document.createElement("div");d.textContent=s==null?"":s;return d.innerHTML}
  function inr(n){return "₹"+Math.round(n).toLocaleString("en-IN")}
  function fmtDate(d){if(!d)return "—";var x=new Date(d+"T00:00:00");return isNaN(x)?"—":x.toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}
  function addYears(d,n){var x=new Date(d+"T00:00:00");x.setFullYear(x.getFullYear()+n);x.setDate(x.getDate()-1);return x.toISOString().slice(0,10)}
  function age(dob){if(!dob)return 30;var b=new Date(dob),n=new Date();var a=n.getFullYear()-b.getFullYear();var m=n.getMonth()-b.getMonth();if(m<0||(m===0&&n.getDate()<b.getDate()))a--;return a}

  function calc(){
    var t=$("type").value,sum=+$("sum").value||0,term=Math.max(1,+$("term").value||1),a=age($("dob").value);
    var ageF=a<30?0.9:a<45?1:a<60?1.35:1.8;
    var base=sum*RATE[t]*ageF*term;
    var gst=base*0.18;
    return {a:a,base:base,gst:gst,total:base+gst,sum:sum,term:term};
  }

  function rows(pairs){return "<table>"+pairs.map(function(p){return "<tr><th>"+p[0]+"</th><td>"+p[1]+"</td></tr>"}).join("")+"</table>"}

  function holder(){
    return rows([
      ["Name",esc($("name").value)],
      ["Date of birth",fmtDate($("dob").value)+" (age "+calc().a+")"],
      ["Address",esc($("addr").value)],
      ["Contact",esc($("phone").value)+" · "+esc($("email").value)],
      ["Nominee",esc($("nominee").value)||"—"]
    ]);
  }

  function premiumTable(c){
    return "<table><tr><th>Base premium</th><td>"+inr(c.base)+"</td></tr>"+
      "<tr><th>GST (18%)</th><td>"+inr(c.gst)+"</td></tr>"+
      "<tr class='total'><th>Total payable</th><td>"+inr(c.total)+"</td></tr></table>";
  }

  function header(title,sub){
    return "<div class='head'><div><h2>"+title+"</h2><p class='sub' style='margin:2px 0 0'>"+sub+"</p></div>"+
      "<div class='no'>Policy no.<br><strong>"+polNo+"</strong><br>Issued "+fmtDate(new Date().toISOString().slice(0,10))+"</div></div>";
  }

  function cert(){
    var t=$("type").value,c=calc(),s=$("start").value,e=s?addYears(s,c.term):"";
    return header("Certificate of Insurance",LABEL[t]+" insurance policy")+
      "<h3>Policyholder</h3>"+holder()+
      "<h3>Policy details</h3>"+rows([
        ["Cover type",LABEL[t]],
        ["Sum insured",inr(c.sum)],
        ["Policy period",fmtDate(s)+" to "+fmtDate(e)+" ("+c.term+" year"+(c.term>1?"s":"")+")"],
        ["Details",esc($("extra").value)||"—"]
      ])+
      "<h3>What is covered</h3><ol>"+COVER[t].map(function(x){return "<li>"+x+"</li>"}).join("")+"</ol>"+
      "<h3>Premium</h3>"+premiumTable(c)+
      "<h3>Key conditions</h3><ol><li>This certificate is valid only when the premium has been received in full.</li><li>Claims must be reported within 7 days of the event.</li><li>Misrepresentation of facts may make the policy void.</li></ol>"+
      "<div class='seal'>ISSUED<br>&amp; SEALED</div>"+
      "<div class='sign'><div>Policyholder signature</div><div>Authorised signatory</div></div>";
  }

  function quote(){
    var t=$("type").value,c=calc(),valid=new Date();valid.setDate(valid.getDate()+30);
    return header("Insurance Quotation",LABEL[t]+" insurance, valid until "+fmtDate(valid.toISOString().slice(0,10)))+
      "<h3>Prepared for</h3>"+holder()+
      "<h3>Proposed cover</h3>"+rows([["Cover type",LABEL[t]],["Sum insured",inr(c.sum)],["Term",c.term+" year"+(c.term>1?"s":"")],["Proposed start",fmtDate($("start").value)]])+
      "<h3>Premium estimate</h3>"+premiumTable(c)+
      "<p style='font-size:13.5px'>This quotation is an estimate based on the details provided. The final premium may change after underwriting review.</p>"+
      "<div class='sign'><div>Customer acceptance</div><div>Agent / underwriter</div></div>";
  }

  function claim(){
    var t=$("type").value;
    return header("Claim Form",LABEL[t]+" insurance claim")+
      "<h3>Policyholder</h3>"+holder()+
      "<h3>Policy reference</h3>"+rows([["Policy number",polNo],["Sum insured",inr(+$("sum").value||0)],["Details",esc($("extra").value)||"—"]])+
      "<h3>Claim details</h3>"+rows([
        ["Date of incident","______________________"],
        ["Place of incident","______________________"],
        ["Nature of loss","<br><br>"],
        ["Amount claimed (₹)","______________________"],
        ["Documents attached","☐ ID proof &nbsp; ☐ Bills / estimates &nbsp; ☐ Police report (if any)"]
      ])+
      "<p style='font-size:13.5px'>I declare that the information given above is true and complete to the best of my knowledge.</p>"+
      "<div class='sign'><div>Claimant signature and date</div><div>Received by (insurer)</div></div>";
  }

  function render(){
    var html=mode==="cert"?cert():mode==="quote"?quote():claim();
    $("doc").innerHTML=html;
  }

  function syncType(){
    var t=$("type").value;
    $("extraWrap").firstChild.nodeValue=PLACEHOLDER[t]+" ";
    $("extra").value=DEFAULTS[t];
    polNo=makeNo();
    render();
  }

  // init
  var today=new Date().toISOString().slice(0,10);
  $("start").value=today;
  $("type").addEventListener("change",syncType);
  Array.prototype.forEach.call(document.querySelectorAll("#f input,#f textarea,#f select"),function(el){
    if(el.id!=="type")el.addEventListener("input",render);
  });
  Array.prototype.forEach.call(document.querySelectorAll(".tabs button"),function(b){
    b.addEventListener("click",function(){
      mode=b.getAttribute("data-doc");
      Array.prototype.forEach.call(document.querySelectorAll(".tabs button"),function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});
      render();
    });
  });
  $("newno").addEventListener("click",function(){polNo=makeNo();render()});
  $("print").addEventListener("click",function(){window.print()});
  syncType();
})();
