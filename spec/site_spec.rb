require 'spec_helper'

describe 'Jekyll Site' do
  it 'builds successfully and contains valid HTML' do
    options = {
      :check_html => true,
      :check_img_http => true,
      :disable_external => false, # Enable external link checking
      :enforce_https => false,
      :ignore_urls => [],
      :hydra => { :max_concurrency => 5 },
      :typhoeus => {
        :connecttimeout => 15,
        :timeout => 60,
        :ssl_verifyhost => 0,
        :ssl_verifypeer => false,
      },
      :ignore_status_codes => [403, 429, 999] # Ignore status codes often returned to bots
    }

    # Run HTMLProofer on the _site directory
    HTMLProofer.check_directory('./_site', options).run
  end
end
