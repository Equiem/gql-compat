// Provide a test double for the shelljs module.
import td from "testdouble";

const shell = td.replace("shelljs");

import shelljs from "shelljs";

export = shell as typeof shelljs;
