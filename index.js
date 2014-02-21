var gaze = require("gaze"),
    growly = require("growly"),
    spawn = require("child_process").spawn,
    ok_re = /^OK \(.* tests?, .* assertions?\)$/m,
    ng_re = /^FAILURES!\n(Tests?: .*, Assertions?: .*, Failures?: .*\.)/m;

gaze("tests/**.php", function (err, watcher) {
  this.on("all", function (event, filepath) {
    if (event === "added" || event === "changed") {
      var phpunit = spawn("vendor\\bin\\phpunit.bat", [filepath], {stdio: "pipe"});
      phpunit.stdout.on("data", function (data) {
        var match;
        console.log(data.toString());
        if (match = ok_re.exec(data)) {
          growly.notify(match[0], {title: "OK"});
        }
        if (match = ng_re.exec(data)) {
          growly.notify(match[1], {title: "FAILURES"});
        }
      });
    }
  });
});
