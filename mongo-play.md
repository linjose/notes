mongoimport --db test --collection dusts --type csv --headerline --file dusts3.json

mongoimport --db test --file Desktop/MongoPlay/EndemicAnimals.json --jsonArray

db.EndemicAnimals.find({},  {CommonNameC: 1})
