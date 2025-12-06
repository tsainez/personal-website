require 'spec_helper'

describe 'Jekyll Site' do
  it 'builds successfully and contains valid HTML' do
    options = {
      :check_html => true,
      :check_img_http => true,
      :disable_external => true, # Disable external link checking for speed/reliability in CI
      :enforce_https => false,
      :ignore_urls => [],
      :hydra => { :max_concurrency => 1 }
    }

    # Run HTMLProofer on the _site directory
    HTMLProofer.check_directory('./_site', options).run
  end
end
