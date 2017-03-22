name := baseDirectory.value.getName
version := "1.0-SNAPSHOT"
scalaVersion := "2.11.2"

val scalazVersion = "7.1.0"

libraryDependencies ++= Seq(
)

scalacOptions += "-feature"

initialCommands in console := ""
