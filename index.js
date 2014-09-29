var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var helpers = require('broccoli-kitchen-sink-helpers')
var Writer = require('broccoli-writer');
var handlebars = require('handlebars');
var _ = require("lodash");

function setValue(object, path, value) {
  var a = path.split('.');
  var o = object;
  for (var i = 0; i < a.length - 1; i++) {
      var n = a[i];
      if (n in o) {
          o = o[n];
      } else {
          o[n] = {};
          o = o[n];
      }
  }
  o[a[a.length - 1]] = value;
}


module.exports = Precompiler
Precompiler.prototype = Object.create(Writer.prototype)
Precompiler.prototype.constructor = Precompiler

function Precompiler (inputTree, options) {
  if (!(this instanceof Precompiler)) return new Precompiler(inputTree, options)
  this.inputTree = inputTree
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key]
    }
  }
}

Precompiler.prototype.write = function (readTree, destDir) {
  var self = this
  
  var myDestDir = path.join(destDir, self.outputFolder);
      
  return readTree(this.inputTree).then(function (srcDir) {
    var languages = fs.readdirSync(srcDir).filter(function(d){
      var stats = fs.statSync(path.join(srcDir, d));
      return d[0] != '.' && stats.isDirectory(); // Just exclude anything which starts with a . and isn't a directory
    });

    // setup the output-folder
    mkdirp.sync(myDestDir);
    
    languages.forEach(function(language) {
      var outputFile = path.join(myDestDir, language+".js");
      var languageDir = path.join(srcDir, language);
      
      var inputFiles = helpers.multiGlob(['**/*.json'], {cwd: languageDir})

      var output = {};

      inputFiles.forEach(function(inputFile) {
        var inputFilePath = path.join(languageDir, inputFile);
        var valuePath = inputFile.substring(0,inputFile.indexOf('.json')).replace(/\//g,'.');
        
        var content = fs.readFileSync(inputFilePath, {encoding: 'utf8'});
        
        var tmp = JSON.parse(content);
        if (valuePath === '_') {
          output = _.merge(output, tmp);
        } else {
          setValue(output, valuePath, tmp);
        }
      });
      
      var string = JSON.stringify(output, null, "  ");
      var result = string.replace(/:\s*["'](.*)["'](,?)/gi, function(match, p1, p2) {
        var unescaped = unescape(p1);
        var res = handlebars.precompile(unescaped);
        return ": t(" + res.toString() + ")" + (p2 || ""); // We need to add back the colon and possibly the comma at the end
      });
      var outputString = 'define("translations/'+language+'",["exports"],function(e){"use strict"; var t = Handlebars.template; var o = '+result+'; e["default"]= o;});';

      fs.writeFileSync(outputFile, outputString);
    });
  });
}


