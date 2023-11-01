# Deprecation Notice

This GitHub Action has been deprecated and will no longer be maintained as of December 31st, 2023. Similar functionality is now available through the consolidated [fortify/github-action](https://github.com/marketplace/actions/fortify-ast-scan) and its sub-actions; please update your GitHub workflows to use these actions instead.


# Setup Fortify Bug Tracker Utility

Build secure software fast with [Fortify](https://www.microfocus.com/en-us/solutions/application-security). Fortify offers end-to-end application security solutions with the flexibility of testing on-premises and on-demand to scale and cover the entire software development lifecycle. With Fortify, find security issues early and fix at the speed of DevOps. 

The Fortify Bug Tracker Utility syncronizes security issues between Fortify on Demand/Fortify Software Security Center and a wide range of defect management and GRC systems including Jira, ALM Octane, Archer, etc.  This GitHub Action sets up the Fortify Bug Tracker Utility for use in your GitHub workflows:
* Downloads and caches the specified version of the Fortify Bug Tracker Utility distribution
* Adds the `FBTU_JAR` environment variable containing the full path to the Fortify Bug Tracker Utility JAR file
* Adds the `FBTU_DIR` environment variable containing the full path to the directory where the distribution zip file was extracted

## Usage

```yaml
on:
  schedule:
    - cron:  '* 7,18 * * *'                   # Sync defects at defined interval

steps:
- uses: actions/setup-java@v1                 # Set up Java
  with:
    java-version: 1.8                         # Bug tracker utility has been successfully tested with 1.8, other versions may also work
- uses: fortify/gha-setup-bugtracker-utility@v1 # Set up Fortify Bug Tracker Utility
  with:
    version: 4.10                               # Optional as this is the default
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

## Information for Developers

All commits to the `main` or `master` branch should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention. In particular, commits using the `feat: Some feature` and `fix: Some fix` convention are used to automatically manage version numbers and for updating the [CHANGELOG.md](https://github.com/fortify/gha-setup-bugtracker-utility/blob/master/CHANGELOG.md) file.

Whenever changes are pushed to the `main` or `master` branch, the [`.github/workflows/publish-release.yml`](https://github.com/fortify/gha-setup-bugtracker-utility/blob/master/.github/workflows/publish-release.yml) workflow will be triggered. If there have been any commits with the `feat:` or `fix:` prefixes, the [`release-please-action`](https://github.com/google-github-actions/release-please-action) will generate a pull request with the appropriate changes to the CHANGELOG.md file and version number in `package.json`. If there is already an existing pull request, based on earlier feature or fix commits, the pull request will be updated.

Once the pull request is accepted, the `release-please-action` will publish the new release to the GitHub Releases page and tag it with the appropriate `v{major}.{minor}.{patch}` tag. The two `richardsimko/update-tag` action instances referenced in the `publish-release.yml` workflow will create or update the appropriate `v{major}.{minor}` and `v{major}` tags, allowing users to reference the action by major, minor or patch version.
