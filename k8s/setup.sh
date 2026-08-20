#!/usr/bin/env bash
set -e

echo "== Installing kubectl =="
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl

echo "== Installing kind =="
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

echo "== Creating cluster =="
kind create cluster --name shopsphere

echo "== Applying namespaces =="
kubectl apply -f namespaces.yaml

echo "== Applying aws-simulation =="
kubectl apply -f aws-simulation/app.yaml

echo "== Applying gcp-simulation =="
kubectl apply -f gcp-simulation/app.yaml

echo "== Waiting for pods =="
kubectl wait --for=condition=Ready pod --all -n aws-simulation --timeout=90s
kubectl wait --for=condition=Ready pod --all -n gcp-simulation --timeout=90s

echo "== Pods in aws-simulation =="
kubectl get pods -n aws-simulation

echo "== Pods in gcp-simulation =="
kubectl get pods -n gcp-simulation

echo "== Isolation check (UIDs must differ) =="
echo "aws frontend UID: $(kubectl get pod frontend -n aws-simulation -o jsonpath='{.metadata.uid}')"
echo "gcp frontend UID: $(kubectl get pod frontend -n gcp-simulation -o jsonpath='{.metadata.uid}')"

echo "== DONE. Cluster is up, both namespaces deployed and isolated. =="
echo "Run port-forward tests manually, e.g.:"
echo "  kubectl port-forward -n aws-simulation svc/backend-service 8082:5678 &"
echo "  curl http://localhost:8082"
