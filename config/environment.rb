# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
WaKeyPress::Application.initialize!

S3 = YAML.load(File.read(File.expand_path('../s3.yml', __FILE__)))