const _ = require('lodash');
const urijs = require('urijs');

const account = require('../sample_account.json');

/**
 *
 * TODO:
 *
 * 1. Fix strategy for name
 * 2. Finish extracting the domain from website values
 *
 * Add new strategies to array:
 *
 * 3. Compute unified value for number of employees
 * 4. Compute unified value for name of country
 * 5. Compute unified value for ISO-2 country code.
 *
 * Use all available data in sample_account.json *
 *
 * Bonus: Add new features to Compute if something becomes repetetive.
 *
 * During the interview, please be prepared to show and run the program.
 *
 */

// change to true/false if you want to see the entire Compute instance logged.
const CONSOLE_LOG_COMPUTE_DATA = true;

const STRATEGIES = [
  // Something is wrong with this strategy, can't figure out why it doesn't work.
  {
    output_property: 'account/name',
    input_properties: ['clearbit.name', 'hubspot.name', 'goodfit.name'],
  },
  // Need to finish this using urijs
  {
    output_property: 'domain',
    input_properties: [
      'hubspot.website',
      'system.first_known_website',
      'clearbit.domain',
    ],
    compute_template: 'custom',
    custom_method: (values) => {
      // How to get the right value here?
      const website = _.head(values);
      const uri = urijs(website);
      // console.log(uri);
      return 'placeholder.com';
    },
  },
  {
    output_property: 'icp_properties/estimated_revenue',
    input_properties: [
      'clearbit.metrics_annual_revenue',
      'hubspot.annual_revenue',
    ],
    compute_template: 'max',
  },
];

class Compute {
  constructor(strategy) {
    this.output_property = strategy.output_property;
    this.input_properties = strategy.input_properties;
    this.compute_template = strategy.compute_template;
    this.custom_method = strategy.custom_method || this._computeCustomMethod;
    this.update_needed = false;
    this.attribute_data = [];
    this.attribute = {};
  }

  run() {
    this._composeAttributeData();
    switch (this.compute_template) {
      case 'most_frequent':
        this._computeMostFrequentValue(this.attribute_data);
        break;
      case 'max':
        this._computeHighestValue(this.attribute_data);
        break;
      case 'custom':
        this._computeCustomMethod(this.attribute_data);
        break;
      default:
        return;
    }

    this._checkExitConditions();
    if (CONSOLE_LOG_COMPUTE_DATA) {
      console.log(this, '\n');
    }
  }

  _computeCustomMethod(values) {
    if (_.isEmpty(values)) return;
    const attribute = this.custom_method(values);
    this.attribute[this.output_property] = attribute;
  }

  _computeHighestValue(values) {
    if (_.isEmpty(values)) return;
    this.attribute[this.output_property] = _.max(values);
  }

  _computeMostFrequentValue(values) {
    if (_.isEmpty(values)) return;
    this.attribute[this.output_property] = _.head(
      _(values).countBy().entries().maxBy(_.last)
    );
  }

  _composeAttributeData() {
    const values = _.map(this.input_properties, (property) => {
      const value = _.get(account, property, undefined);
      return value;
    });
    this.attribute_data = _.compact(values);
  }

  _checkExitConditions() {
    const isEmpty = (target) => {
      const keys = Object.keys(target);
      return keys.length === 0;
    };

    if (this.output_property === undefined) return;
    if (isEmpty(this.attribute) === true) return;

    const path = _.replace(this.output_property, '/', '.');
    const currentAttributeValue = _.get(account, path, undefined);

    if (currentAttributeValue === undefined) {
      this.update_needed = true;
      return;
    }

    const isNewValue = !_.isEqual(this.attribute, {
      [this.output_property]: currentAttributeValue,
    });

    if (isNewValue === true) {
      this.update_needed = true;
      return;
    }

    return false;
  }
}

const attributes = {};

_.forEach(STRATEGIES, (strategy) => {
  const compute = new Compute(strategy);
  compute.run();

  const hasValue = compute.attribute[compute.output_property];

  if (compute.update_needed === true && hasValue) {
    _.assign(attributes, compute.attribute);
  }
});

console.log('UPDATED ATTRIBUTES:', attributes);
