Rails.application.routes.draw do
  resources :inkcontracts do
    member do
      get 'download'
    end
  end
  resources :contracts
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
