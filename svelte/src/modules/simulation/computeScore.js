import { variables2014, llikelihood2014 } from './scoreData'
import { group } from 'd3'

function average(a, b){
  // \frac{1}{b-a} ( \ln(e^b+1) - \ln(e^b+1) )
  return 1/(b-a)*(Math.log(Math.exp(b)+1) - Math.log(Math.exp(a) + 1))
}

function set_compute_score(){
  const coeff_vars = new Map();
  const default_vals = new Map();
  const extent_of_vars = new Map();
  /* TODO put in utils */
  function sigmoid(ll){
      return 1 / (1 + Math.exp(-ll))
  }
  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  /********/
  let extent_min = - 1.73654727320913,
      extent_max = - 1.73654727320913;
  const group_likelihood = group(llikelihood2014, (x)=> x.Variable)
  for (let variable of variables2014){
      const v = variable.Variable
      const val = group_likelihood.get(v)
      let min_extent_var = null,
          max_extent_var = null;
      const coeff_var = new Map();
      for (let opt of val){
          const coeff = +opt.Loglikelihood;
          coeff_var.set(opt["Value"], coeff)
          if (min_extent_var === null || min_extent_var > coeff){
              min_extent_var = coeff
          }
          if (max_extent_var === null || max_extent_var < coeff)
              max_extent_var = coeff
          if (opt.defaut === "oui"){
              default_vals.set(v, opt["Value"])
          }
      }
      coeff_vars.set(v, coeff_var)
      extent_min += min_extent_var
      extent_max += max_extent_var
      extent_of_vars.set(v, [min_extent_var, max_extent_var])
  }
  return function compute_score(args){
      const c = - 1.73654727320913
      let defaut_ll = c,
          min_extent = c,
          max_extent = c;
      for (let variable of variables2014){
          const v = variable.Variable;
          if (args[v]){
              const coeff = coeff_vars.get(v).get(args[v]);
              if (coeff === undefined)
                  return [v, args[v], coeff_vars.get(v)]
              min_extent += coeff;
              max_extent += coeff;
              defaut_ll += coeff;
          } else {
              const [min_extent_var, max_extent_var] = extent_of_vars.get(v);
              min_extent += min_extent_var
              max_extent += max_extent_var
              defaut_ll += coeff_vars.get(v).get(default_vals.get(v))
          }
      }
      //return [(defaut_ll + 12.9)/25.8, (min_extent + 12.9)/25.8, (max_extent + 12.9)/25.8]
      return {default: sigmoid(defaut_ll), min:sigmoid(min_extent), max:sigmoid(max_extent), average:average(min_extent, max_extent)}
  }
}

export const computeScore = set_compute_score()
