const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanySchema = new Schema({
  title: { type: String, required: true },
  address: String,
  telephone: String,
  fax: String,
  website: String,
  host: Boolean,
  countryId: String
})

const Company = mongoose.model('company', CompanySchema)

module.exports = Company
