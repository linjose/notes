mongoimport --db test --collection dusts --type csv --headerline --file dusts3.json

mongoimport --db test --file Desktop/MongoPlay/EndemicAnimals.json --jsonArray

db.EndemicAnimals.find({},  {CommonNameC: 1})


db.EndemicAnimals.find({},
{_id: 0,
ClassC: 1, CommonNameC:  1, OrderC: 1}
)

