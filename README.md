# Setup Fortify Bug Tracker Utility

Build secure software fast with [Fortify](https://www.microfocus.com/en-us/solutions/application-security). Fortify offers end-to-end application security solutions with the flexibility of testing on-premises and on-demand to scale and cover the entire software development lifecycle. With Fortify, find security issues early and fix at the speed of DevOps. This GitHub Action sets up the Fortify Bug Tracker Utility for use in your GitHub workflows:
* Downloads and caches the specified version of the Fortify Bug Tracker Utility distribution
* Adds the `FBTU_JAR` environment variable containing the full path to the Fortify Bug Tracker Utility JAR file
* Adds the `FBTU_DIR` environment variable containing the full path to the directory where the distribution zip file was extracted

## Usage

```yaml
steps:
- uses: actions/setup-java@v1                 # Set up Java
  with:
    java-version: 1.8
- uses: fortify/gha-setup-bugtracker-utility@v1 # Set up Fortify Bug Tracker Utility
  with:
    version: 4.1                                 # Optional as this is the default
- env:
    FBTU_FODBASEURL: https://ams.fortify.com/
    FBTU_FODTENANT: ${{ secrets.FOD_TENANT }}
    FBTU_FODUSERNAME: ${{ secrets.FOD_USER }}
    FBTU_FODPASSWORD: ${{ secrets.FOD_PAT }}
    FBTU_FODRELEASEID: 999999
    FBTU_JIRABASEURL: https://myjira.atlassian.net/
    FBTU_JIRAUSERNAME: ${{ secrets.JIRA_USER }}
    FBTU_JIRAPASSWORD: ${{ secrets.JIRA_TOKEN }}
    FBTU_JIRAPROJECTKEY: MyJiraProject
  run: |
    java -jar "$FBTU_JAR" -configFile "$FBTU_DIR/FoDToJira.xml" -FoDBaseUrl "$FBTU_FODBASEURL" -FoDTenant "$FBTU_FODTENANT" -FoDUserName "$FBTU_FODUSERNAME" -FoDPassword "$FBTU_FODPASSWORD" -FoDReleaseId "$FBTU_FODRELEASEID" --JiraBaseUrl "$FBTU_JIRABASEURL" -JiraUserName "$FBTU_JIRAUSERNAME" -JiraPassword "$FBTU_JIRAPASSWORD" -JiraProjectKey "$FBTU_JIRAPROJECTKEY"
```

As can be seen in this example, the Fortify Bug Tracker Utility can simply be invoked by running `java -jar $FBTU_JAR`.
The `-configFile` option can point to either one of the default configuration files shipped with the utility,
or a configuration file available elsewhere on the system or in your project workspace. For utility versions 4.1 and
lower, command line options must be explicitly specified on the command line. Version 4.2 and up will support the 
`FBTU_`-prefixed environment variables out of the box, so these will no longer need to be passed on the command line.

Please see the [Fortify Bug Tracker Utility documentation](https://github.com/fortify-ps/FortifyBugTrackerUtility) for more details.

## Inputs

### `version`
**Required** The version of the Fortify Bug Tracker Utility to be set up. Default `4.1`. This must be an actual version number; `latest` is not supported.

## Outputs

### `FBTU_JAR` environment variable
Specifies the full path to the Fortify Bug Tracker Utility JAR file

### `FBTU_DIR` environment variable
Specifies the full path to the directory where the distribution zip file was extracted; among others this directory holds
the default configuration files shipped with the utility.
