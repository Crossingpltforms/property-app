// import AsyncStorage from "@react-native-community/async-storage";
import { Sentry, SentryLog } from "react-native-sentry";
// import VersionNumber from "react-native-version-number";

const SentryReport = {
  sentryInstall() {
    Sentry.config(
      "https://d72dd7d160174c8a87bbc8e4c40fc21b@sentry.io/2209214",
      {
        logLevel: SentryLog.Debug,
        deactivateStacktraceMerging: true
      }
    );

    Sentry.install();
  },

  sentryTagInfo() {
    Sentry.setTagsContext({
      environment: "Production",
      react: true
    });
    // Sentry.setVersion(
    //   `${VersionNumber.appVersion}(${VersionNumber.buildVersion})`
    // );
  },
  report() {
    //SentryReport.apiErrorReport("Test For session logs android", "Test");
    //Sentry.nativeCrash();
    // AsyncStorage.getItem("userInfo").then(userInfo => {
    //   if (userInfo) {
    //     const user = JSON.parse(userInfo);
    //     // set the user context
    //     Sentry.setUserContext({
    //       username: `${user.full_name}`,
    //       email: `${user.email}` // `${user.firstName}${user.lastName}${user.id}@gmail.com`,
    //       // extra: {
    //       //   is_admin: false,    // If we need extra data sent on sentry
    //       // },
    //     });
    //     // SentryReport.apiErrorReport("Test For session logs2 iOS", "Test");
    //     // setTimeout(() => {]
    //     //   Sentry.nativeCrash(); //For testing purpose only
    //     // }, 7000);
    //   }
    // });
  },
  apiErrorReport(err) {
    Sentry.captureException(err);
  },
  captureMessage(msg) {
    Sentry.captureMessage(msg);
  }
};
export default SentryReport;
