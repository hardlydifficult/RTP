// Creator: n1d1MCYdbGHaKgtD1fKjLrrYdbY7gJAsFsf 
const Nebulas = require('nebulas');
const fs = require('fs');
let conf = null;
let contract_address = null;//"n1q75o3W1akm7H9qFbxQGFUyg7aR6o3uhXa";//"n1mjmg5nhrh4zJgdSnS4tMZyW3gTj3oBLg9";//"n1hgeDhch4Vu6JrrL6EtDj7PXCVbRwr6dGp"; //

try{
  conf = require('./config.json');
}catch (e) {
  console.log('failed to load config.json. Try to run "yarn run generateconfig" first.');
  process.exit(1);
}

const contractSource = fs.readFileSync('./contract.js').toString();
const apiUrl = "https://mainnet.nebulas.io";//"http://localhost:8685";//

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var options;
var receipt;
let neb = new Nebulas.Neb();

async function run(){
  let account = new Nebulas.Account();
  account.setPrivateKey(conf.account.privateKey);

  neb.setRequest(new Nebulas.HttpRequest(apiUrl));
  let nebState = await neb.api.getNebState();
  let accountState = await neb.api.getAccountState(account.getAddressString());

  options = {
    from : account,
    to : account.getAddressString(),
    nonce : parseInt(accountState.nonce) + 1,
    gasPrice: 1000000,
    gasLimit: 2000000,
    contract : {
      source : contractSource,
      sourceType : 'js',
      args : '[0]',
      function : 'save'
    },
    chainID : nebState.chain_id
  };

  let transaction = new Nebulas.Transaction(options);
  transaction.signTransaction();

  let payload = {
    data : transaction.toProtoString()
  };
  let response = null;
  if(!contract_address)
  {
    response = await neb.api.sendRawTransaction(payload);
    console.log(response);
    await sleep(20000);
  }
  else
  {
    options.nonce--;
  }

  let attempt = 0;
  while(1===1){
    if(!contract_address)
    {
      receipt = await neb.api.getTransactionReceipt({hash:response.txhash});
    }

    if(contract_address || receipt.status === 1){
      if(receipt)
      {
        console.log(`Transaction no longer pending. Receipt:`);
        console.log(receipt);
        contract_address = receipt.contract_address;
      }

      if(contract_address && contract_address.length > 0){
        let toSource = require('tosource');
        //write to the config file
        let content = "/*AUTOGENERATED BY DEPLOY SCRIPT. DO NOT EDIT*/\n";
        let obj = {
          apiUrl : apiUrl,
          contract : contract_address
        };
        content += "neb_contract=" + toSource(obj) + ";";
        fs.writeFileSync('../../static/settings.js', content);

        // await callMethod("setStartingResources", "1000"); 
        // await callMethod("setWorldResources", "1000000000000"); 
        // await callMethod("setEventConfig", {
        //   "interval": "20", 
        //   "min_reward": "1000000", 
        //   "max_reward": "42000000000", 
        //   "min_reward_percent": "1", 
        //   "max_reward_percent": "300", 
        //   "min_length": "3", 
        //   "max_length": "6"});
          //{"name": "Exit Scam NOW! (new contract coming)", "sort_id": 1,    "start_price": "9",             "nas_price": "50000000000", "resources_per_s": "1"},

        // var item_make_a_commit = "Make a Commit on Github";
        // var items = [
        //   // .0001 nas == .05 cents
        //   // $5 == 1 nas
        //   // Roadmap
        //   {name: "Announce an Announcement", sort_id: 100,    start_price: "9",             nas_price: "150000000000", resources_per_s: "1"},
        //   {name: item_make_a_commit, sort_id: 200,            start_price: "159",           nas_price: "800000000000" /* .0001 nas*/, resources_per_s: "5"},
        //   {name: "Do a Giveaway on Twitter", sort_id: 300,    start_price: "1015",          nas_price: "1700000000000", resources_per_s: "10"},
        //   {name: "Publish Performance Numbers", sort_id: 400, start_price: "8888",          nas_price: "4400000000000", resources_per_s: "25"},
        //   {name: "Incite FOMO", sort_id: 500,                 start_price: "42001",         nas_price: "9000000000000", resources_per_s: "50"},
        //   {name: "Release Audit", sort_id: 600,               start_price: "302099",        nas_price: "19000000000000", resources_per_s: "100"},
        //   {name: "Announce Partnership", sort_id: 700,        start_price: "5050050",       nas_price: "98000000000000", resources_per_s: "500"},
        //   {name: "Release Wallet", sort_id: 800,              start_price: "699999999",     nas_price: "1970000000000000", resources_per_s: "10000"},
        //   {name: "Rebrand", sort_id: 900,                     start_price: "7500000000",    nas_price: "9900000000000000", resources_per_s: "50000"},
        //   {name: "Buy Exchange Listing", sort_id: 1000,       start_price: "20000000000",   nas_price: "20000000000000000", resources_per_s: "100000"},

        //   // Advisors
        //   {name: "Tom Lee", sort_id: 1100,                    start_price: "420000000",     nas_price: "10000000000000000", bonus_multiplier: "1"},
        //   {name: "Craig Grant", sort_id: 1200,                start_price: "1250000000",    nas_price: "21000000000000000", bonus_multiplier: "2"},
        //   {name: "Ian Balina", sort_id: 1300,                 start_price: "5000000000",    nas_price: "53000000000000000", bonus_multiplier: "5"},
        //   {name: "Suppoman", sort_id: 1400,                   start_price: "20000000000",   nas_price: "85000000000000000", bonus_multiplier: "8"},
        //   {name: "Dr Craig S Wright", sort_id: 1500,          start_price: "45000000000",   nas_price: "110000000000000000", bonus_multiplier: "10"},
        //   {name: "Trevon James", sort_id: 1600,               start_price: "75000000000",   nas_price: "145000000000000000", bonus_multiplier: "13"},
        //   {name: "Roger Ver", sort_id: 1700,                  start_price: "125000000000",  nas_price: "170000000000000000", bonus_multiplier: "15"},
        //   {name: "John McAfee", sort_id: 1800,                start_price: "200000000000",  nas_price: "230000000000000000", bonus_multiplier: "20"},
        //   {name: "Carlos Matos", sort_id: 1900,               start_price: "300000000000",  nas_price: "300000000000000000", bonus_multiplier: "25"},
        // ]

        // for(var i = 0; i < items.length; i++)
        // {
        //   await callMethod("createItem", items[i]); 
        // }

        // for(var i = 0; i < items.length; i++)
        // {
        //   nebWrite("createItem", [items[i]]); 
        //   sleep(5000);
        // }

        // For testing: 
        // await callMethod("isOwner");
        // await callMethod("getOrCreateUser");
        // await callMethod("getUser", ["n1S5JNP13pnoyswKbGtrtE3Bexz6pbtKaPj"]);
        // await callMethod("launchICO", ["HardlyValuable", "HV1"])
        // await callMethod("getActiveICO");
        // await callMethod("getICO");
        // await callMethod("getICOId", ["HV"]);
        // await callMethod("getSmartContractBalance");
        // await callMethod("getMyResources");
        // await callMethod("getMyResourcesNasValue");
        // await callMethod("getMyItemProductionRate", item_make_a_commit);
        // await callMethod("getMyProductionRate");
        // await callMethod("getTimePassed");
        // await callMethod("getMyProductionSinceLastRedeem");
        // await callMethod("getMyItemBonus", item_make_a_commit);
        // await callMethod("getMyBonus");
        // await callMethod("getMyPendingResources");
        // await callMethod("redeemResources");
        // await callMethod("getAllItemNames");
        // await callMethod("getItemRaw", item_make_a_commit);
        // await callMethod("getItem", item_make_a_commit);
        // await callMethod("getMyItemCount", item_make_a_commit);
        // await callMethod("getTotalCostFor", [item_make_a_commit, "10000"]);
        // await callMethod("getMyItemPrice", [item_make_a_commit, "10000"]);
        // await callMethod("getMaxICanAfford", [item_make_a_commit]);
        // await callMethod("buy", ["Make a Commit on Github", "2"]);
        // await callMethod("getInfo");
        // await callMethod("getBestKnownScammers");
        // await callMethod("getBestKnownScammers", [1, 10]);
        // await callMethod("getICOStats");
        // await callMethod("getCoinMarketCaps");
        // await callMethod("getCoinMarketCaps", [1, 10]);
        // await callMethod("getList", "all_items");
        // await callMethod("exitScam");
        // await callMethod("launchICO", ["HardlyValuable", "HV2"])
        // await callMethod("buy", ["Make a Commit on Github", "1"]);




        
        var my_wallet = "n1S5JNP13pnoyswKbGtrtE3Bexz6pbtKaPj";
        await callMethod("changeOwner", my_wallet);
      }

      return;
    }else if(receipt.status === 0){
      console.log('Deploy failed');
      console.log(receipt);
      process.exit(1);
    }else if(receipt.status === 2){
      attempt++;
      console.log(`Transaction pending... attempt: ${attempt} - ${new Date()}`);
      if(attempt === 1)
        console.log(receipt);
      await sleep(3000);
    }
  }
}

run();

async function callMethod(method, args)
{
  try {

    if(!(args instanceof Array))
    {
      args = [args];
    }
    options.to = contract_address;
    options.contract = {
      function: method,
      args: JSON.stringify(args)
    };
    options.nonce++;
    var transaction = new Nebulas.Transaction(options);
    options.nonce--;
    transaction.signTransaction();
    
    let payload = {
      data : transaction.toProtoString()
    };
    await neb.api.sendRawTransaction(payload);
    await sleep(1000);
    console.log("sent: " + JSON.stringify(payload));
    options.nonce++;
  } 
  catch(e)
  {
    console.log("FAIL... will try again: " + e);
    await sleep(2000);
    await callMethod(method, args);
  }
}